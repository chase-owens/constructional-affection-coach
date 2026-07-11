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
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
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

    const interviewFunction = new nodejs.NodejsFunction(
      this,
      "CaInterviewFunction",
      {
        functionName: "ca-coach-interview",
        runtime: lambda.Runtime.NODEJS_22_X,

        entry: "../lambdas/src/interview/index.ts",
        projectRoot: "../lambdas",
        depsLockFilePath: "../lambdas/package-lock.json",

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

    openAiSecret.grantRead(interviewFunction);

    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
  }
}
