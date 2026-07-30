# Constructional Affection Coach Infrastructure

This package contains the AWS Cloud Development Kit (CDK) infrastructure for the Constructional Affection Coach platform.

The infrastructure provisions the complete production AWS environment used by the application, including hosting, authentication, APIs, persistence, deployment, observability, and AI orchestration. :contentReference[oaicite:0]{index=0}

---

## Architecture

```text
                        GitHub Actions
                              │
                    OIDC Deploy Role
                              │
                              ▼
                     CloudFront Distribution
                              │
                              ▼
                           S3 Bucket
                              │
                              ▼
                         SvelteKit Client
                              │
                              ▼
                         HTTP API Gateway
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
 Interview Orchestrator                  Interview APIs
          │                                       │
          ▼                                       ▼
 OpenAI + Program Worker                  DynamoDB Table
          │
          ▼
 Generated Constructional Affection Programs
```

---

## AWS Resources

The stack provisions:

### Frontend

- Amazon S3
- Amazon CloudFront
- ACM certificate
- Custom domain
- Origin Access Control (OAC)

The client is served from a private S3 bucket through CloudFront using HTTPS.

---

### Authentication

Amazon Cognito provides:

- user registration
- email verification
- authentication
- JWT authorization
- API Gateway authorizers

Users may begin interviews anonymously and later associate them with an authenticated account.

---

### API

Amazon API Gateway exposes the application backend.

Current endpoints include:

- interview creation
- interview progression
- interview retrieval
- interview claiming
- program generation

API Gateway also provides:

- CORS
- JWT authorization
- structured access logging

---

### Compute

AWS Lambda functions perform application orchestration.

Responsibilities include:

- interview orchestration
- OpenAI communication
- structured response validation
- retry handling
- interview persistence
- asynchronous program generation

The interview orchestration layer intentionally separates deterministic application behavior from probabilistic model behavior.

---

### Persistence

Amazon DynamoDB stores interview and program state.

Current design includes:

- interview records
- generated programs
- user ownership
- update timestamps

A global secondary index supports retrieving interviews by user.

---

### Secrets

AWS Secrets Manager stores:

- OpenAI API credentials

Secrets are injected into Lambda functions through IAM rather than committed to source control.

---

## Security

The infrastructure follows AWS security best practices including:

- private S3 buckets
- CloudFront Origin Access Control
- least-privilege IAM policies
- Cognito authentication
- API authorization
- GitHub OIDC deployment
- Secrets Manager
- protected production branches

---

## Observability

Application health is monitored through Amazon CloudWatch.

Logging includes:

- Lambda application logs
- API Gateway access logs
- request identifiers
- HTTP status codes
- integration latency
- integration errors
- response sizes

Structured logging supports debugging interview orchestration, validation, retries, and AI-assisted program generation.

---

## CI/CD

Production deployment is performed through GitHub Actions.

Deployment includes:

1. workspace validation
2. application build
3. AWS authentication through GitHub OIDC
4. S3 synchronization
5. CloudFront invalidation

No long-lived AWS credentials are stored in GitHub.

---

## Deployment

Bootstrap the AWS account (once):

```bash
npx cdk bootstrap
```

Deploy:

```bash
npx cdk deploy
```

Preview infrastructure changes:

```bash
npx cdk diff
```

Generate the synthesized CloudFormation template:

```bash
npx cdk synth
```

Destroy the stack (development only):

```bash
npx cdk destroy
```

---

## Current Status

The infrastructure currently supports the production Constructional Affection Coach application.

Current development focuses on:

- supporting the evolving MCP architecture
- expanding interview orchestration
- methodology evaluation
- experiment infrastructure
- future participant-facing program execution

The existing Lambda orchestration serves as the production baseline while MCP is developed as an alternative orchestration strategy.
