import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import type OpenAI from "openai";
import {
  CONSTRUCTIONAL_ASSETS_BASELINE,
  INTERACTION_CHAIN_BASELINE,
  isRunnableInterviewPhase,
  PROGRAM_INITIALIZATION_BASELINE,
  TARGET_OUTCOME_BASELINE,
  type ConstructionalAssets,
  type InteractionChain,
} from "@constructional-affection/domain";
import { runConstructionalAssetsInterview } from "./constructional-assets";
import { runInteractionChainInterview } from "./interaction-chain";
import { runTargetOutcomeInterview } from "./target-outcome";
import { logger } from "../shared/logger";
import { getOpenAiClient } from "./get-openai-client";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import type {
  InterviewPhase,
  PhaseVersionMetadata,
  TargetOutcome,
} from "@constructional-affection/domain";

//ORCHESTRATION LAYER

const lambdaClient = new LambdaClient({});

type InterviewMessage = {
  role: "coach" | "user";
  content: string;
};

type InterviewRequest = {
  interviewId: `${string}-${string}-${string}-${string}-${string}`;
  phase: InterviewPhase;
  messages: InterviewMessage[];
  targetOutcome?: TargetOutcome | null;
  constructionalAssets?: ConstructionalAssets | null;
  interactionChain?: InteractionChain | null;
};

export type RunnableInterviewPhase = Exclude<
  InterviewPhase,
  "revise_target_outcome" | "complete"
>;

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

const runInterviewPhase = async (
  openai: OpenAI,
  request: InterviewRequest,
  metadata: PhaseVersionMetadata,
) => {
  switch (request.phase) {
    case "target_outcome":
      const result = await runTargetOutcomeInterview(openai, request.messages);

      return { metadata, result };

    case "interaction_chain": {
      if (!request.targetOutcome) {
        throw new Error(
          "targetOutcome is required for the interaction_chain phase.",
        );
      }

      const result = await runInteractionChainInterview(
        openai,
        request.messages,
        request.targetOutcome,
      );

      return { metadata, result };
    }

    case "constructional_assets": {
      if (!request.targetOutcome || !request.interactionChain) {
        throw new Error(
          "targetOutcome and interactionChain are required for the constructional_assets phase.",
        );
      }

      const result = await runConstructionalAssetsInterview(
        openai,
        request.messages,
        request.targetOutcome,
      );

      return { metadata, result };
    }
  }
};

const getPhaseMetadata = (phase: RunnableInterviewPhase) => {
  switch (phase) {
    case "target_outcome":
      return TARGET_OUTCOME_BASELINE;

    case "interaction_chain":
      return INTERACTION_CHAIN_BASELINE;

    case "constructional_assets":
      return CONSTRUCTIONAL_ASSETS_BASELINE;

    case "program_initialization":
      return PROGRAM_INITIALIZATION_BASELINE;
  }
};

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const requestId = event.requestContext.requestId;
  const startedAt = Date.now();
  const interviewId = event.pathParameters?.interviewId;
  let selectedMetadata: ReturnType<typeof getPhaseMetadata> | undefined;

  try {
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

    if (!isRunnableInterviewPhase(request.phase)) {
      return jsonResponse(400, {
        error: "phase is required.",
      });
    }

    if (request.messages && !Array.isArray(request.messages)) {
      return jsonResponse(400, {
        error: "messages must be an array.",
      });
    }

    selectedMetadata = getPhaseMetadata(request.phase);

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
              metadata: selectedMetadata,
              targetOutcome: request.targetOutcome,
              constructionalAssets: request.constructionalAssets,
              interactionChain: request.interactionChain,
            }),
          ),
        }),
      );

      logger.info("program.worker.invoked", {
        requestId,
        ...selectedMetadata,
        interviewId,
      });

      return jsonResponse(202, {
        interviewId,
        ...selectedMetadata,
        status: "pending",
      });
    }

    const runnablePhases: readonly RunnableInterviewPhase[] = [
      "target_outcome",
      "interaction_chain",
      "constructional_assets",
    ];

    if (!runnablePhases.includes(request.phase as RunnableInterviewPhase)) {
      return jsonResponse(400, {
        error: `Unsupported interview phase: ${request.phase}`,
      });
    }

    const openai = await getOpenAiClient();
    const phaseResult = await runInterviewPhase(
      openai,
      request,
      selectedMetadata,
    );

    if (phaseResult?.result) {
      logger.info("interview.request.completed", {
        requestId,
        interviewId,
        ...selectedMetadata,
        phaseComplete: phaseResult.result.phaseComplete ?? false,
      });
    } else {
      logger.info("interview.request.completed", {
        requestId,
        interviewId,
        ...selectedMetadata,
        phaseComplete: false,
      });
    }

    return jsonResponse(200, phaseResult);
  } catch (error) {
    logger.error("interview.request.failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "unknown error",
      ...selectedMetadata,
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
