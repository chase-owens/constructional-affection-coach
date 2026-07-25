import OpenAI from "openai";
import {
  TargetOutcomeController,
  type InterviewMessage,
} from "./controllers/target-outcome";
import { InterviewPhaseValidationError } from "../program/errors";
import type { ValidationIssue } from "../validation/types";

const MAX_ATTEMPTS = 2;

export const runTargetOutcomeInterview = async (
  openai: OpenAI,
  messages: InterviewMessage[],
) => {
  const controller = new TargetOutcomeController(openai);

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
