import OpenAI from "openai";
import {
  InteractionChainController,
  type InterviewMessage,
} from "./controllers/interaction-chain";
import type { ValidationIssue } from "../validation/types";
import { InterviewPhaseValidationError } from "../program/errors";

const MAX_ATTEMPTS = 2;

export const runInteractionChainInterview = async (
  openai: OpenAI,
  messages: InterviewMessage[],
) => {
  const controller = new InteractionChainController(openai);

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
