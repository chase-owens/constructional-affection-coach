import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as logs from "aws-cdk-lib/aws-logs";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";

import path from "path";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const repoRoot = path.join(__dirname, "../..");
const lambdaProjectRoot = path.join(repoRoot, "lambdas");

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
    projectRoot: repoRoot,
    depsLockFilePath: path.join(repoRoot, "package-lock.json"),
    handler: "handler",
    environment: { TABLE_NAME: tableName },
    timeout: cdk.Duration.seconds(120),
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

    // Add client user pool, app client, and authorizer
    const coachUserPool = new cognito.UserPool(this, "CoachUserPool", {
      userPoolName: "ca-coach-client-user-pool",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
    });

    coachUserPool.addDomain("CoachCognitoDomain", {
      cognitoDomain: { domainPrefix: "ca-coach-client" },
    });

    const coachPoolClient = coachUserPool.addClient("ClientUserPoolClient", {
      authFlows: { userPassword: true, userSrp: true },
      generateSecret: false,
    });

    const coachAuthorizer = new HttpUserPoolAuthorizer(
      "ClientAuthorizer",
      coachUserPool,
      { userPoolClients: [coachPoolClient] },
    );

    new cdk.CfnOutput(this, "ClientCognitoAuthority", {
      value: coachUserPool.userPoolProviderUrl,
    });

    new cdk.CfnOutput(this, "ClientCognitoClientId", {
      value: coachPoolClient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "ClientCognitoUserPoolId", {
      value: coachUserPool.userPoolId,
    });

    new cdk.CfnOutput(this, "ClientCognitoDomain", {
      value: `https://ca-coach-client.auth.${this.region}.amazoncognito.com`,
    });

    // Get secrets
    const openAiSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "CaOpenAiSecret",
      "constructional-affection/openai",
    );

    // Create Buckets
    const clientBucket = new s3.Bucket(this, "CaClientBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    // Create custom domain cert
    const certificate = new acm.Certificate(this, "CaCertificate", {
      domainName: "constructionalaffectioncoach.com",
      subjectAlternativeNames: ["www.constructionalaffectioncoach.com"],
      validation: acm.CertificateValidation.fromDns(),
    });

    // Create client distribution
    const clientDistribution = new cloudfront.Distribution(
      this,
      "CaDistribution",
      {
        certificate,
        defaultRootObject: "index.html",
        defaultBehavior: {
          origin: origins.S3BucketOrigin.withOriginAccessControl(clientBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          functionAssociations: [],
        },
        domainNames: [
          "constructionalaffectioncoach.com",
          "www.constructionalaffectioncoach.com",
        ],
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

    const githubOidcProvider =
      iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        "GitHubOidcProvider",
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
      );

    const githubDeployRole = new iam.Role(this, "GitHubDeployRole", {
      roleName: "ca-coach-github-deploy",
      assumedBy: new iam.OpenIdConnectPrincipal(githubOidcProvider, {
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub":
            "repo:chase-owens/constructional-affection-coach:ref:refs/heads/main",
        },
      }),
      description:
        "Allows GitHub Actions on main to deploy the Constructional Affection Coach client.",
    });

    clientBucket.grantReadWrite(githubDeployRole);

    githubDeployRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [clientDistribution.distributionArn],
      }),
    );

    new cdk.CfnOutput(this, "GitHubDeployRoleArn", {
      value: githubDeployRole.roleArn,
    });

    // Create table
    const caProgramTable = dynamodb.Table.fromTableName(
      this,
      "CaProgramTable",
      "ca-program-table",
    );

    // Create worker lambda
    const startProgramLambda = createNodeLambda(this, "StartProgramLambda", {
      functionName: "ca-start-program-interviews",
      entry: path.join(lambdaProjectRoot, "src/program/start-program.ts"),
      memorySize: 1024,
      environment: {
        TABLE_NAME: caProgramTable.tableName,
        OPENAI_SECRET_ARN: openAiSecret.secretArn,
      },
    });

    // Create Lambdas to read and write from table
    const getInterviewsLambda = createNodeLambda(this, "GetInterviews", {
      functionName: "ca-get-interviews",
      entry: path.join(
        lambdaProjectRoot,
        "src/interview/get-interviews/index.ts",
      ),
    });

    const getInterviewLambda = createNodeLambda(this, "GetInterview", {
      functionName: "ca-get-interview",
      entry: path.join(
        lambdaProjectRoot,
        "src/interview/get-interview/index.ts",
      ),
    });

    const createInterviewLambda = createNodeLambda(this, "CreateInterview", {
      functionName: "ca-create-interview",
      entry: path.join(
        lambdaProjectRoot,
        "src/interview/create-interview/index.ts",
      ),
    });

    const claimInterviewLambda = createNodeLambda(
      this,
      "ClaimInterviewLambda",
      {
        functionName: "ca-claim-interview",
        entry: path.join(
          lambdaProjectRoot,
          "src/interview/claim-interview/index.ts",
        ),
        environment: { TABLE_NAME: caProgramTable.tableName },
      },
    );

    // Create Lambda for MCP handler
    const mcpLambda = createNodeLambda(this, "McpLambda", {
      functionName: "ca-mcp-server",
      entry: path.join(lambdaProjectRoot, "src/mcp/index.ts"),
      memorySize: 512,
      environment: { OPENAI_SECRET_ARN: openAiSecret.secretArn },
    });

    caProgramTable.grantWriteData(createInterviewLambda);
    caProgramTable.grantReadData(getInterviewsLambda);
    caProgramTable.grantReadData(getInterviewLambda);
    caProgramTable.grantReadWriteData(startProgramLambda);
    caProgramTable.grantWriteData(claimInterviewLambda);

    // Grant lambdas read/write access to table
    const interviewFunction = new nodejs.NodejsFunction(
      this,
      "CaInterviewFunction",
      {
        functionName: "ca-interview-orchestrator",
        runtime: lambda.Runtime.NODEJS_22_X,

        entry: path.join(lambdaProjectRoot, "src/interview/index.ts"),
        projectRoot: repoRoot,
        depsLockFilePath: path.join(repoRoot, "package-lock.json"),

        handler: "handler",
        timeout: cdk.Duration.seconds(120),
        memorySize: 1024,

        environment: {
          OPENAI_SECRET_ARN: openAiSecret.secretArn,
          PROGRAM_WORKER_FUNCTION_NAME: startProgramLambda.functionName,
        },
      },
    );

    const api = new apigatewayv2.HttpApi(this, "CaApi", {
      apiName: "Constructional Affection Coach API",
      corsPreflight: {
        allowOrigins: [
          "https://d3ih19l4laq6p0.cloudfront.net",
          "https://constructionalaffectioncoach.com",
          "https://www.constructionalaffectioncoach.com",
          "http://localhost:5173",
        ],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.OPTIONS,
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.DELETE,
        ],
        allowHeaders: ["Content-Type", "Authorization"],
      },
    });

    const apiAccessLogs = new logs.LogGroup(this, "CaApiAccessLogs", {
      logGroupName: "/aws/apigateway/constructional-affection-coach",
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const defaultStage = api.defaultStage!.node
      .defaultChild as apigatewayv2.CfnStage;

    defaultStage.accessLogSettings = {
      destinationArn: apiAccessLogs.logGroupArn,
      format: JSON.stringify({
        requestId: "$context.requestId",
        routeKey: "$context.routeKey",
        status: "$context.status",
        integrationStatus: "$context.integration.status",
        integrationLatency: "$context.integrationLatency",
        integrationErrorMessage: "$context.integrationErrorMessage",
        errorMessage: "$context.error.message",
        responseLength: "$context.responseLength",
      }),
    };

    api.addRoutes({
      path: "/interviews/{interviewId}/claim",
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        "ClaimUserIdIntegration",
        claimInterviewLambda,
      ),
      authorizer: coachAuthorizer,
    });

    api.addRoutes({
      path: "/interviews/{interviewId}/phase",
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
        "GetInterviewsIntegration",
        getInterviewsLambda,
      ),
      authorizer: coachAuthorizer,
    });

    api.addRoutes({
      path: "/interviews/{interviewId}",
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration(
        "GetInterviewIntegration",
        getInterviewLambda,
      ),
    });

    api.addRoutes({
      path: "/mcp",
      methods: [apigatewayv2.HttpMethod.ANY],
      integration: new integrations.HttpLambdaIntegration(
        "McpIntegration",
        mcpLambda,
      ),
    });

    openAiSecret.grantRead(mcpLambda);
    openAiSecret.grantRead(interviewFunction);
    openAiSecret.grantRead(startProgramLambda);
    startProgramLambda.grantInvoke(interviewFunction);

    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
  }
}
