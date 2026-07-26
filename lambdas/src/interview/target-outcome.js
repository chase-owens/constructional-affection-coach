"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTargetOutcomeInterview = void 0;
const target_outcome_1 = require("./controllers/target-outcome");
const errors_1 = require("../program/errors");
const MAX_ATTEMPTS = 2;
const runTargetOutcomeInterview = async (openai, messages) => {
    const controller = new target_outcome_1.TargetOutcomeController(openai);
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
            console.warn("target_outcome.validation.failed", {
                attempt,
                issues: validationIssues.map((issue) => ({
                    path: issue.path.map(String).join("."),
                    code: issue.code,
                    message: issue.message,
                })),
            });
        }
    }
    throw new Error("Target outcome interview exhausted all attempts");
};
exports.runTargetOutcomeInterview = runTargetOutcomeInterview;
