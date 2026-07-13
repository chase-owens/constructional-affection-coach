import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import path from "path";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const lambdaProjectRoot = path.join(__dirname, "../../lambdas");

const createNodeLambda = (
  scope: Construct,
  id: string,
  props: NodejsFunctionProps,
  tableName = "ca-program-table",
) =>
  new NodejsFunction(scope, id, {
    runtime: lambda.Runtime.NODEJS_22_X,
    architecture: lambda.Architecture.ARM_64,
    memorySize: 256,
    projectRoot: lambdaProjectRoot,
    depsLockFilePath: path.join(lambdaProjectRoot, "package-lock.json"),
    handler: "handler",
    environment: { TABLE_NAME: tableName },
    timeout: cdk.Duration.seconds(60),
    bundling: {
      minify: true,
      sourceMap: true,
    },
    ...props,
  });

export class InfraStack extends cdk.Stack {
  public readonly interviewsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Get secrets
    const openAiSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "CaOpenAiSecret",
      "constructional-affection/openai",
    );

    // Create Buckets
    const clientBucket = new s3.Bucket(this, "CaClientBucket", {
      bucketName: "ca-coach-client",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // Create custom domain cert
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "CaCertificate",
      "arn:aws:acm:us-east-1:657830185399:certificate/ca385ed8-ffde-4d6c-87cb-fae28af00f6b",
    );

    // Create client distribution
    const clientDistribution = new cloudfront.Distribution(
      this,
      "CaDistribution",
      {
        // certificate,
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(clientBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [],
        },
        // domainNames: ["coach.constructionalaffection.com"],
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      },
    );

    // Create table
    this.interviewsTable = new dynamodb.Table(this, "CaProgramTable", {
      tableName: "ca-program-table",
      partitionKey: {
        name: "interviewId",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Create Lambdas to read and write from table
    const getInterviewsLambda = createNodeLambda(this, "GetInterviews", {
      functionName: "ca-get-interviews",
      entry: path.join(
        __dirname,
        "../../lambdas/src/interview/get-interviews/index.ts",
      ),
    });

    const createInterviewLambda = createNodeLambda(this, "CreateInterview", {
      functionName: "ca-create-interview",
      entry: path.join(
        __dirname,
        "../../lambdas/src/interview/create-interview/index.ts",
      ),
    });

    this.interviewsTable.grantWriteData(createInterviewLambda);
    this.interviewsTable.grantReadData(getInterviewsLambda);

    // Grant lambdas read/write access to table
    const interviewFunction = new nodejs.NodejsFunction(
      this,
      "CaInterviewFunction",
      {
        functionName: "ca-coach-interview",
        runtime: lambda.Runtime.NODEJS_22_X,

        entry: path.join(lambdaProjectRoot, "src/interview/index.ts"),
        projectRoot: lambdaProjectRoot,
        depsLockFilePath: path.join(lambdaProjectRoot, "package-lock.json"),

        handler: "handler",
        timeout: cdk.Duration.seconds(60),
        memorySize: 1024,

        environment: { OPENAI_SECRET_ARN: openAiSecret.secretArn },
      },
    );

    const api = new apigatewayv2.HttpApi(this, "CaApi", {
      apiName: "Constructional Affection Coach API",
      corsPreflight: {
        allowOrigins: [
          "https://d3ih19l4laq6p0.cloudfront.net",
          "https://coach.constructionalaffection.com",
          "http://localhost:5173",
        ],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.OPTIONS,
          apigatewayv2.CorsHttpMethod.GET,
        ],
        allowHeaders: ["Content-Type"],
      },
    });

    api.addRoutes({
      path: "/interview",
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "CaInterviewIntegration",
        interviewFunction,
      ),
    });

    api.addRoutes({
      path: "/interviews",
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "CreateInterviewIntegration",
        createInterviewLambda,
      ),
    });

    api.addRoutes({
      path: "/interviews",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "GetInterviewLambda",
        getInterviewsLambda,
      ),
    });

    openAiSecret.grantRead(interviewFunction);

    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
  }
}
