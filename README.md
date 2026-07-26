# Constructional Affection Coach

Constructional Affection Coach is an AI-assisted interview and program-building platform for creating individualized Constructional Affection programs.

The application combines a SvelteKit client, serverless AWS backend, structured AI workflows, persistent user programs, and an emerging MCP integration in a single Nx-managed monorepo.

## Architecture

The repository is organized as a monorepo containing the client application, backend services, AWS infrastructure, and MCP tooling.

```text
constructional-affection/
├── constructional-affection-coach/   # SvelteKit client
├── lambdas/                           # AWS Lambda services
├── infra/                             # AWS CDK infrastructure
├── mcp/                               # MCP server and tools
├── .github/                           # CI/CD workflows
├── Dockerfile
├── nx.json
└── package.json
```

Nx coordinates development, builds, type checking, linting, and tests across the workspace.

## Applications and Packages

### Client

`constructional-affection-coach/`

The user-facing application is built with:

- SvelteKit
- TypeScript
- Tailwind CSS
- Vitest

The client provides:

- guided Constructional Affection interviews
- structured multi-phase interview progression
- authenticated user accounts
- saved programs
- program viewing
- responsive desktop and mobile interfaces

### Lambda Services

`lambdas/`

Node.js and TypeScript Lambda functions provide the application's serverless backend.

Responsibilities include:

- creating interviews
- retrieving interviews and programs
- associating interviews with authenticated users
- orchestrating interview phases
- generating programs
- interacting with the OpenAI API
- persisting application state in DynamoDB

AI responses are structured and validated before being incorporated into the application workflow.

### Infrastructure

`infra/`

AWS infrastructure is defined with the AWS CDK and deployed as infrastructure as code.

The production architecture includes:

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon Cognito
- Amazon S3
- Amazon CloudFront
- AWS Secrets Manager
- Amazon CloudWatch
- AWS IAM

The client is distributed through CloudFront from a private S3 origin and is available at:

https://constructionalaffectioncoach.com

### MCP

`mcp/`

The MCP package provides the foundation for exposing Constructional Affection capabilities as structured tools and resources.

The goal is to separate domain operations from any individual user interface, allowing methodology, validation, examples, and future coaching capabilities to be consumed through a standardized interface.

MCP development is currently in progress.

## AI Workflow

The application uses the OpenAI API as part of a controlled interview and program-generation workflow rather than as an unrestricted chatbot.

The interview progresses through defined phases that collect and transform information needed to construct a program.

```text
Target Outcome
      ↓
Constructional Assets
      ↓
Interaction Chain
      ↓
Program Initialization
      ↓
Generated Program
```

Structured responses allow application code to validate AI output and maintain deterministic application state around probabilistic model behavior.

## Authentication and Persistence

Amazon Cognito provides user authentication.

Interviews can begin before authentication and later be associated with an authenticated user.

Completed programs are persisted in DynamoDB and can be retrieved through authenticated API routes.

A DynamoDB secondary index supports retrieving programs by user and update time.

## Development

Install dependencies from the repository root:

```bash
npm install
```

Run the client:

```bash
npm run dev
```

Run workspace type and framework checks:

```bash
npm run check
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

Build the workspace:

```bash
npm run build
```

Nx executes the corresponding targets across the appropriate workspace projects.

## Docker

The repository includes a Docker development and validation environment so the workspace can be checked in a reproducible Node.js environment independent of the host machine.

Build the image:

```bash
docker build -t ca-coach .
```

Run workspace checks with the required client environment:

```bash
docker run --rm \
  --env-file constructional-affection-coach/.env \
  ca-coach npm run check
```

The same container can execute other workspace commands by replacing `npm run check`.

## Testing and Quality

The project uses automated checks across the monorepo, including:

- TypeScript type checking
- Svelte diagnostics
- ESLint
- Vitest
- Nx workspace orchestration
- Docker-based environment validation

Pull requests are validated with GitHub Actions.

The `main` branch is protected by repository rules requiring the configured quality checks to pass before changes can be merged.

## CI/CD

GitHub Actions provides continuous integration and deployment.

The deployment workflow uses GitHub OIDC integration with AWS rather than storing long-lived AWS credentials in the repository.

Production deployment includes:

1. validating the workspace
2. building the client
3. authenticating with AWS through OIDC
4. synchronizing the production build to S3
5. invalidating the CloudFront distribution

Branch protection prevents changes with failing required checks from being merged into `main`.

## Observability

The backend includes structured application logging and API access logging through Amazon CloudWatch.

API Gateway access logs capture information including:

- request ID
- route
- HTTP status
- integration status
- integration latency
- integration errors
- response size

Application logging is designed to support tracing failures through interview orchestration, validation, retry handling, and program generation.

## Security

The application uses several AWS security controls:

- private S3 origins
- CloudFront Origin Access Control
- Cognito authentication
- API Gateway authorization
- IAM least-privilege permissions
- Secrets Manager for API credentials
- GitHub Actions OIDC for AWS deployment
- protected production branches

Secrets and environment-specific credentials are not committed to the repository.

## Current Development

The core application is deployed and functional.

Current development is focused on expanding the architecture beyond the initial coach interface, including:

- MCP resources and tools
- methodology validation
- published-example retrieval
- participant-facing program execution
- program progress and session tracking
- additional coaching capabilities

## Methodology

Constructional Affection approaches behavior change by identifying and constructing desired interaction patterns rather than beginning with the suppression of unwanted behavior.

The application operationalizes that process through a structured interview that identifies:

- the desired interaction
- existing constructional assets
- relevant reinforcers
- interaction sequences
- transfer points
- progressive program stages

For a detailed description of the interview methodology and client behavior, see the README in `constructional-affection-coach/`.

## Author

Built by Chase Hendrix.

Constructional Affection Coach explores how structured AI systems can support the analysis and construction of individualized Constructional Affection programs.
