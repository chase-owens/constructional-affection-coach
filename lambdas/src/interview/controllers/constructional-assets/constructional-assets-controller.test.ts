import { beforeEach, describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import { z } from "zod";

import type { ValidationIssue } from "../../../validation/types";
import { ConstructionalAssetsController } from "./constructional-assets-controller";
import { constructionalProgramMock } from "../../../test/fixtures/constructionalProgram.mock";

const { targetOutcome } = constructionalProgramMock;

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

const openai = {
  responses: {
    create: mocks.create,
  },
} as unknown as OpenAI;

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

// for deterministic evaluation - this should fail semantic evaluation - proximity should resolve to reinforcing
const validCompletedResponse = {
  phaseComplete: true,
  constructionalAssets: {
    socialReinforcers: {
      approachesVoluntarily: "yes",
      evidence: ["She loves being pet, scratched and praised"],
      reinforcers: {
        touch: "clearly_reinforcing",
        talk: "clearly_reinforcing",
        eyeContact: "unclear",
        proximity: "unclear",
      },
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

const createValidationIssues = (): ValidationIssue[] => {
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

  return result.error.issues;
};

describe("ConstructionalAssetsController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a valid constructional assets response from OpenAI", async () => {
    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(validCompletedResponse),
    });

    const controller = new ConstructionalAssetsController(openai);

    const result = await controller.interview(messages, targetOutcome);

    expect(result).toEqual(validCompletedResponse);
    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("throws InterviewPhaseValidationError when OpenAI returns invalid constructional assets", async () => {
    const invalidResponse = {
      phaseComplete: true,
      constructionalAssets: {
        ...validCompletedResponse.constructionalAssets,
        socialReinforcers: {
          ...validCompletedResponse.constructionalAssets.socialReinforcers,
          reinforcers: {
            ...validCompletedResponse.constructionalAssets.socialReinforcers
              .reinforcers,

            // Deliberately violate the schema.
            touch: "really_likes_it",
          },
        },
      },
    };

    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(invalidResponse),
    });

    const controller = new ConstructionalAssetsController(openai);

    await expect(
      controller.interview(messages, targetOutcome),
    ).rejects.toMatchObject({
      name: "InterviewPhaseValidationError",
      code: "INTERVIEW_PHASE_VALIDATION_FAILED",
      phase: "constructional_assets",
    });

    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("adds validation feedback to the OpenAI request when validation issues are supplied", async () => {
    const validationIssues = createValidationIssues();

    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(validCompletedResponse),
    });

    const controller = new ConstructionalAssetsController(openai);

    await controller.interview(messages, targetOutcome, validationIssues);

    expect(mocks.create).toHaveBeenCalledOnce();

    const request = mocks.create.mock.calls[0][0];

    const correctionMessage = request.input.find(
      (item: { role: string; content: string }) =>
        item.role === "system" &&
        item.content.includes(
          "The previous response failed schema validation.",
        ),
    );

    expect(correctionMessage).toBeDefined();

    expect(correctionMessage.content).toContain("touch");

    expect(correctionMessage.content).toContain(validationIssues[0].message);
  });
});
