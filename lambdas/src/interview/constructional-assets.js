"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runConstructionalAssetsInterview = void 0;
const constructional_assets_1 = require("./controllers/constructional-assets");
const errors_1 = require("../program/errors");
const MAX_ATTEMPTS = 2;
const runConstructionalAssetsInterview = async (openai, messages) => {
    const controller = new constructional_assets_1.ConstructionalAssetsController(openai);
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
            console.warn("constructional_assets.validation.failed", {
                attempt,
                issues: validationIssues.map((issue) => ({
                    path: issue.path.map(String).join("."),
                    code: issue.code,
                    message: issue.message,
                })),
            });
        }
    }
    throw new Error("Constructional assets interview exhausted all attempts");
};
exports.runConstructionalAssetsInterview = runConstructionalAssetsInterview;
