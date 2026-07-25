import { beforeEach, describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import { z } from "zod";
import { InterviewPhaseValidationError } from "../program/errors";

const mocks = vi.hoisted(() => ({
  interview: vi.fn(),
}));

vi.mock("./controllers/constructional-assets", () => ({
  ConstructionalAssetsController: class {
    interview = mocks.interview;
  },
}));

import { runConstructionalAssetsInterview } from "./constructional-assets";

const openai = {} as OpenAI;

const messages = [
  {
    role: "coach" as const,
    content: "What does your dog already enjoy from you?",
  },
  {
    role: "user" as const,
    content: "She really likes petting, scratches, and when I talk to her.",
  },
];

const validResult = {
  phaseComplete: true as const,
  constructionalAssets: {
    socialReinforcers: {
      touch: "clearly_reinforcing" as const,
      talk: "clearly_reinforcing" as const,
      eyeContact: "unclear" as const,
      proximity: "unclear" as const,
    },
    relevantSkills: [
      {
        name: "Sit",
        context: "When asked while the person is standing.",
        notes: "The dog reliably sits in this context.",
      },
    ],
    conditionsWhereTargetPatternOccurs: [
      {
        description: "Person stands calmly near the dog.",
        behaviorObserved: "Dog sits calmly nearby.",
        notes: "This provides an existing calm starting condition.",
      },
    ],
    notes:
      "Touch and talk appear useful for supporting the target interaction.",
  },
};

const createValidationError = () => {
  const schema = z.object({
    touch: z.enum([
      "clearly_reinforcing",
      "sometimes_reinforcing",
      "unclear",
      "not_reinforcing",
      "over_arousing",
    ]),
  });

  const result = schema.safeParse({
    touch: "really_likes_it",
  });

  if (result.success) {
    throw new Error("Expected validation fixture to fail.");
  }

  return new InterviewPhaseValidationError(
    "constructional_assets",
    result.error,
  );
};

describe("runConstructionalAssetsInterview", () => {
  beforeEach(() => {
    mocks.interview.mockReset();
  });

  it("returns without retrying when the first attempt is valid", async () => {
    mocks.interview.mockResolvedValueOnce(validResult);

    const result = await runConstructionalAssetsInterview(openai, messages);

    expect(result).toEqual(validResult);

    expect(mocks.interview).toHaveBeenCalledOnce();

    expect(mocks.interview).toHaveBeenCalledWith(messages, undefined);
  });

  it("retries with validation issues when the first attempt fails validation", async () => {
    const validationError = createValidationError();

    mocks.interview
      .mockRejectedValueOnce(validationError)
      .mockResolvedValueOnce(validResult);

    const result = await runConstructionalAssetsInterview(openai, messages);

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

    await expect(
      runConstructionalAssetsInterview(openai, messages),
    ).rejects.toBe(secondValidationError);

    expect(mocks.interview).toHaveBeenCalledTimes(2);

    expect(mocks.interview.mock.calls[1]).toEqual([
      messages,
      firstValidationError.validationError.issues,
    ]);
  });

  it("does not retry non-validation errors", async () => {
    const error = new Error("OpenAI request failed");

    mocks.interview.mockRejectedValueOnce(error);

    await expect(
      runConstructionalAssetsInterview(openai, messages),
    ).rejects.toBe(error);

    expect(mocks.interview).toHaveBeenCalledOnce();
  });
});
