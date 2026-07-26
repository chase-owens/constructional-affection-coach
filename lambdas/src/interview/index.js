"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const constructional_assets_1 = require("./constructional-assets");
const interaction_chain_1 = require("./interaction-chain");
const target_outcome_1 = require("./target-outcome");
const logger_1 = require("../shared/logger");
const get_openai_client_1 = require("./get-openai-client");
const client_lambda_1 = require("@aws-sdk/client-lambda");
const lambdaClient = new client_lambda_1.LambdaClient({});
const jsonResponse = (statusCode, body) => ({
    statusCode,
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
});
const runInterviewPhase = async (openai, request) => {
    switch (request.phase) {
        case "target_outcome":
            return (0, target_outcome_1.runTargetOutcomeInterview)(openai, request.messages);
        case "interaction_chain": {
            if (!request.targetOutcome) {
                throw new Error("targetOutcome is required for the interaction_chain phase.");
            }
            return (0, interaction_chain_1.runInteractionChainInterview)(openai, request.messages);
        }
        case "constructional_assets": {
            if (!request.targetOutcome || !request.interactionChain) {
                throw new Error("targetOutcome and interactionChain are required for the constructional_assets phase.");
            }
            return (0, constructional_assets_1.runConstructionalAssetsInterview)(openai, request.messages);
        }
        case "complete":
            return {
                phaseComplete: true,
                coachMessage: "Your starting program is complete.",
            };
    }
};
const handler = async (event) => {
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
        const request = JSON.parse(event.body);
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
            if (!request.targetOutcome ||
                !request.constructionalAssets ||
                !request.interactionChain) {
                return jsonResponse(400, {
                    message: "target outcome, constructional assets, and interaction chain are required for program initialization",
                });
            }
            const workerFunctionName = process.env.PROGRAM_WORKER_FUNCTION_NAME;
            if (!workerFunctionName) {
                throw new Error("PROGRAM_WORKER_FUNCTION_NAME is not configured");
            }
            await lambdaClient.send(new client_lambda_1.InvokeCommand({
                FunctionName: workerFunctionName,
                InvocationType: "Event",
                Payload: Buffer.from(JSON.stringify({
                    interviewId,
                    targetOutcome: request.targetOutcome,
                    constructionalAssets: request.constructionalAssets,
                    interactionChain: request.interactionChain,
                })),
            }));
            logger_1.logger.info("program.worker.invoked", {
                requestId,
                interviewId,
            });
            return jsonResponse(202, {
                interviewId,
                status: "pending",
            });
        }
        const openai = await (0, get_openai_client_1.getOpenAiClient)();
        const result = await runInterviewPhase(openai, request);
        logger_1.logger.info("interview.request.completed", {
            requestId,
            interviewId,
            phase: request.phase,
            phaseComplete: result?.phaseComplete ?? false,
        });
        return jsonResponse(200, result);
    }
    catch (error) {
        logger_1.logger.error("interview.request.failed", {
            requestId,
            durationMs: Date.now() - startedAt,
            errorName: error instanceof Error ? error.name : "unknown error",
        });
        console.error("Interview Lambda failed:", error);
        return jsonResponse(500, {
            error: error instanceof Error
                ? error.message
                : "The interview service could not process the request.",
        });
    }
};
exports.handler = handler;
