import { beforeEach, describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import { z } from "zod";
import { InterviewPhaseValidationError } from "../program/errors";

const mocks = vi.hoisted(() => ({
  interview: vi.fn(),
}));

vi.mock("./controllers/interaction-chain", () => ({
  InteractionChainController: class {
    interview = mocks.interview;
  },
}));

import { runInteractionChainInterview } from "./interaction-chain";

const openai = {} as OpenAI;

const messages = [
  {
    role: "coach" as const,
    content: "What happens immediately before the interaction changes?",
  },
  {
    role: "user" as const,
    content:
      "My dog is calm while I am standing, but starts moving toward me when I begin sitting down.",
  },
];

const validResult = {
  phaseComplete: true as const,
  interactionChain: {
    steps: [
      {
        index: 0,
        actor: "person" as const,
        description: "Person stands near the couch.",
        change: "No meaningful change yet.",
        expectedDogBehavior: "Dog remains calm.",
        targetPatternPresent: true,
        requiresTransfer: false,
        notes: "This is the last stable part of the interaction.",
      },
      {
        index: 1,
        actor: "person" as const,
        description: "Person begins sitting down.",
        change: "Person bends knees and lowers toward the couch.",
        expectedDogBehavior: "Dog begins moving toward the person.",
        targetPatternPresent: false,
        requiresTransfer: true,
        notes: "This is the earliest point where the pattern changes.",
      },
    ],
    constructionStartIndex: 0,
    targetOutcomeIndex: 1,
    notes: "Transfer should begin before the person fully sits.",
  },
};

const createValidationError = () => {
  const schema = z.object({
    phaseComplete: z.boolean(),
  });

  const result = schema.safeParse({
    phaseComplete: "yes",
  });

  if (result.success) {
    throw new Error("Expected validation fixture to fail.");
  }

  return new InterviewPhaseValidationError("interaction_chain", result.error);
};

describe("runInteractionChainInterview", () => {
  beforeEach(() => {
    mocks.interview.mockReset();
  });

  it("returns without retrying when the first attempt is valid", async () => {
    mocks.interview.mockResolvedValueOnce(validResult);

    const result = await runInteractionChainInterview(openai, messages);

    expect(result).toEqual(validResult);

    expect(mocks.interview).toHaveBeenCalledOnce();

    expect(mocks.interview).toHaveBeenCalledWith(messages, undefined);
  });

  it("retries with validation issues when the first attempt fails validation", async () => {
    const validationError = createValidationError();

    mocks.interview
      .mockRejectedValueOnce(validationError)
      .mockResolvedValueOnce(validResult);

    const result = await runInteractionChainInterview(openai, messages);

    expect(result).toEqual(validResult);

    expect(mocks.interview).toHaveBeenCalledTimes(2);

    expect(mocks.interview.mock.calls[0]).toEqual([messages, undefined]);

    expect(mocks.interview.mock.calls[1]).toEqual([
      messages,
      validationError.validationError.issues,
    ]);
  });

  it("throws after both attempts fail validation", async () => {
    const firstValidationError = createValidationError();
    const secondValidationError = createValidationError();

    mocks.interview
      .mockRejectedValueOnce(firstValidationError)
      .mockRejectedValueOnce(secondValidationError);

    await expect(runInteractionChainInterview(openai, messages)).rejects.toBe(
      secondValidationError,
    );

    expect(mocks.interview).toHaveBeenCalledTimes(2);

    expect(mocks.interview.mock.calls[1]).toEqual([
      messages,
      firstValidationError.validationError.issues,
    ]);
  });

  it("does not retry non-validation errors", async () => {
    const error = new Error("OpenAI request failed");

    mocks.interview.mockRejectedValueOnce(error);

    await expect(runInteractionChainInterview(openai, messages)).rejects.toBe(
      error,
    );

    expect(mocks.interview).toHaveBeenCalledOnce();
  });
});
