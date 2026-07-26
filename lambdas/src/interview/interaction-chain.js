"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInteractionChainInterview = void 0;
const interaction_chain_1 = require("./controllers/interaction-chain");
const errors_1 = require("../program/errors");
const MAX_ATTEMPTS = 2;
const runInteractionChainInterview = async (openai, messages) => {
    const controller = new interaction_chain_1.InteractionChainController(openai);
    let validationIssues;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
            return await controller.interview(messages, validationIssues);
        }
        catch (error) {
            if (!(error instanceof errors_1.InterviewPhaseValidationError)) {
                throw error;
            }
            if (attempt === MAX_ATTEMPTS) {
                throw error;
            }
            validationIssues = error.validationError.issues;
            console.warn("interaction_chain.validation.failed", {
                attempt,
                issues: validationIssues.map((issue) => ({
                    path: issue.path.map(String).join("."),
                    code: issue.code,
                    message: issue.message,
                })),
            });
        }
    }
    throw new Error("Interaction chain interview exhausted all attempts");
};
exports.runInteractionChainInterview = runInteractionChainInterview;
