import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import type OpenAI from "openai";

import type {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../schemas";
import { runConstructionalAssetsInterview } from "./constructional-assets";
import { runInteractionChainInterview } from "./interaction-chain";
import { runTargetOutcomeInterview } from "./target-outcome";
import { logger } from "../shared/logger";
import { getOpenAiClient } from "./get-openai-client";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({});

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
    const interviewId = event.pathParameters?.interviewId;

    if (!interviewId) {
      return jsonResponse(400, {
        message: "interviewId is required",
      });
    }

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

    if (request.phase === "program_initialization") {
      if (
        !request.targetOutcome ||
        !request.constructionalAssets ||
        !request.interactionChain
      ) {
        return jsonResponse(400, {
          message:
            "target outcome, constructional assets, and interaction chain are required for program initialization",
        });
      }

      const workerFunctionName = process.env.PROGRAM_WORKER_FUNCTION_NAME;

      if (!workerFunctionName) {
        throw new Error("PROGRAM_WORKER_FUNCTION_NAME is not configured");
      }

      await lambdaClient.send(
        new InvokeCommand({
          FunctionName: workerFunctionName,
          InvocationType: "Event",
          Payload: Buffer.from(
            JSON.stringify({
              interviewId,
              targetOutcome: request.targetOutcome,
              constructionalAssets: request.constructionalAssets,
              interactionChain: request.interactionChain,
            }),
          ),
        }),
      );

      logger.info("program.worker.invoked", {
        requestId,
        interviewId,
      });

      return jsonResponse(202, {
        interviewId,
        status: "pending",
      });
    }

    const openai = await getOpenAiClient();
    const result = await runInterviewPhase(openai, request);

    logger.info("interview.request.completed", {
      requestId,
      interviewId,
      phase: request.phase,
      phaseComplete: result?.phaseComplete ?? false,
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
