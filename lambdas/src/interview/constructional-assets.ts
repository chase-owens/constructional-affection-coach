import OpenAI from "openai";

import {
  ConstructionalAssetsController,
  type InterviewMessage,
} from "./controllers/constructional-assets";
import type { ValidationIssue } from "../validation/types";
import { InterviewPhaseValidationError } from "../program/errors";

const MAX_ATTEMPTS = 2;

export const runConstructionalAssetsInterview = async (
  openai: OpenAI,
  messages: InterviewMessage[],
) => {
  const controller = new ConstructionalAssetsController(openai);

  let validationIssues: ValidationIssue[] | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await controller.interview(messages, validationIssues);
    } catch (error) {
      if (!(error instanceof InterviewPhaseValidationError)) {
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
