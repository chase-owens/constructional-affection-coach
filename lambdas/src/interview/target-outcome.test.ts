import { beforeEach, describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import { z } from "zod";
import { InterviewPhaseValidationError } from "../program/errors";

const mocks = vi.hoisted(() => ({
  interview: vi.fn(),
}));

vi.mock("./controllers/target-outcome", () => ({
  TargetOutcomeController: class {
    interview = mocks.interview;
  },
}));

import { runTargetOutcomeInterview } from "./target-outcome";

const openai = {} as OpenAI;

const messages = [
  {
    role: "coach" as const,
    content:
      "Assuming this process is successful, what would you want to see happening?",
  },
  {
    role: "user" as const,
    content: "I want my dog to remain calm while I sit on the couch.",
  },
];

const validResult = {
  coachMessage: "Tell me a little more about what calm would look like.",
  phaseComplete: false as const,
};

const createValidationError = () => {
  const schema = z.object({
    phaseComplete: z.boolean(),
  });

  const result = schema.safeParse({
    phaseComplete: "yes",
  });

  if (result.success) {
    throw new Error("Expected test fixture to fail validation.");
  }

  return new InterviewPhaseValidationError("target_outcome", result.error);
};

describe("runTargetOutcomeInterview", () => {
  beforeEach(() => {
    mocks.interview.mockReset();
  });

  it("returns without retrying when the first attempt is valid", async () => {
    mocks.interview.mockResolvedValueOnce(validResult);

    const result = await runTargetOutcomeInterview(openai, messages);

    expect(result).toEqual(validResult);

    expect(mocks.interview).toHaveBeenCalledOnce();

    expect(mocks.interview).toHaveBeenCalledWith(messages, undefined);
  });

  it("retries with validation issues when the first attempt fails validation", async () => {
    const validationError = createValidationError();

    mocks.interview
      .mockRejectedValueOnce(validationError)
      .mockResolvedValueOnce(validResult);

    const result = await runTargetOutcomeInterview(openai, messages);

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

    await expect(runTargetOutcomeInterview(openai, messages)).rejects.toBe(
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

    await expect(runTargetOutcomeInterview(openai, messages)).rejects.toBe(
      error,
    );

    expect(mocks.interview).toHaveBeenCalledOnce();
  });
});
