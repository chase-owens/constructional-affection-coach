import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import OpenAI from "openai";

import type {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../domain";
import { runConstructionalAssetsInterview } from "./constructional-assets";
import { runInteractionChainInterview } from "./interaction-chain";
import { runProgramInitialization } from "./program-initialization";
import { runTargetOutcomeInterview } from "./target-outcome";
import { logger } from "../shared/logger";

const secretsManager = new SecretsManagerClient({});

type OpenAiSecret = {
  OPENAI_API_KEY: string;
};

type InterviewMessage = {
  role: "coach" | "user";
  content: string;
};

type InterviewPhase =
  | "target_outcome"
  | "interaction_chain"
  | "constructional_assets"
  | "program_initialization"
  | "complete";

type InterviewRequest = {
  interviewId: `${string}-${string}-${string}-${string}-${string}`;
  phase: InterviewPhase;
  messages: InterviewMessage[];
  targetOutcome?: TargetOutcome | null;
  constructionalAssets?: ConstructionalAssets | null;
  interactionChain?: InteractionChain | null;
};

let openAiClient: OpenAI | null = null;

const getOpenAiClient = async (): Promise<OpenAI> => {
  if (openAiClient) {
    return openAiClient;
  }

  const secretArn = process.env.OPENAI_SECRET_ARN;

  if (!secretArn) {
    throw new Error("OPENAI_SECRET_ARN is not configured.");
  }

  const response = await secretsManager.send(
    new GetSecretValueCommand({
      SecretId: secretArn,
    }),
  );

  if (!response.SecretString) {
    throw new Error("OpenAI secret does not contain a SecretString.");
  }

  const secret = JSON.parse(response.SecretString) as OpenAiSecret;

  if (!secret.OPENAI_API_KEY) {
    throw new Error("Secret is missing OPENAI_API_KEY.");
  }

  openAiClient = new OpenAI({
    apiKey: secret.OPENAI_API_KEY,
  });

  return openAiClient;
};

const jsonResponse = (
  statusCode: number,
  body: unknown,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const runInterviewPhase = async (openai: OpenAI, request: InterviewRequest) => {
  switch (request.phase) {
    case "target_outcome":
      return runTargetOutcomeInterview(openai, request.messages);

    case "interaction_chain": {
      if (!request.targetOutcome) {
        throw new Error(
          "targetOutcome is required for the interaction_chain phase.",
        );
      }

      return runInteractionChainInterview(openai, request.messages);
    }

    case "constructional_assets": {
      if (!request.targetOutcome || !request.interactionChain) {
        throw new Error(
          "targetOutcome and interactionChain are required for the constructional_assets phase.",
        );
      }

      return runConstructionalAssetsInterview(openai, request.messages);
    }

    case "program_initialization": {
      if (
        !request.targetOutcome ||
        !request.constructionalAssets ||
        !request.interactionChain
      ) {
        throw new Error(
          "targetOutcome, constructionalAssets, and interactionChain are required for program initialization.",
        );
      }

      return runProgramInitialization(openai, {
        targetOutcome: request.targetOutcome,
        constructionalAssets: request.constructionalAssets,
        interactionChain: request.interactionChain,
      });
    }

    case "complete":
      return {
        phaseComplete: true,
        coachMessage: "Your starting program is complete.",
      };
  }
};

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const requestId = event.requestContext.requestId;
  const startedAt = Date.now();

  try {
    if (!event.body) {
      return jsonResponse(400, {
        error: "Request body is required.",
      });
    }

    const request = JSON.parse(event.body) as InterviewRequest;

    if (!request.phase) {
      return jsonResponse(400, {
        error: "phase is required.",
      });
    }

    if (request.messages && !Array.isArray(request.messages)) {
      return jsonResponse(400, {
        error: "messages must be an array.",
      });
    }

    const openai = await getOpenAiClient();
    const result = await runInterviewPhase(openai, request);

    logger.info("interview.request.completed", {
      requestId,
      interviewId: request.interviewId,
      phase: request.phase,
      phaseComplete: result.phaseComplete ?? false,
    });

    return jsonResponse(200, result);
  } catch (error) {
    logger.error("interview.request.failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "unknown error",
    });
    console.error("Interview Lambda failed:", error);

    return jsonResponse(500, {
      error:
        error instanceof Error
          ? error.message
          : "The interview service could not process the request.",
    });
  }
};
