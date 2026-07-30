import { beforeEach, describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import { z } from "zod";

import type { ValidationIssue } from "../../../validation/types";
import { InteractionChainController } from "./interaction-chain-controller";
import { constructionalProgramMock } from "../../../test/fixtures/constructionalProgram.mock";

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
    content: "What happens immediately before the interaction changes?",
  },
  {
    role: "user" as const,
    content:
      "My dog is calm while I am standing, but starts moving toward me when I begin sitting down.",
  },
];

const validCompletedResponse = {
  phaseComplete: true,
  interactionChain: {
    steps: [
      {
        index: 0,
        actor: "person",
        description: "Person stands near the couch.",
        change: "No meaningful change yet.",
        expectedDogBehavior: "Dog remains calm.",
        targetPatternPresent: true,
        requiresTransfer: false,
        notes: "This is the last stable part of the interaction.",
      },
      {
        index: 1,
        actor: "person",
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

const createValidationIssues = (): ValidationIssue[] => {
  const schema = z.object({
    requiresTransfer: z.boolean(),
  });

  const result = schema.safeParse({
    requiresTransfer: "yes",
  });

  if (result.success) {
    throw new Error("Expected validation fixture to fail.");
  }

  return result.error.issues;
};

describe("InteractionChainController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a valid interaction chain response from OpenAI", async () => {
    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(validCompletedResponse),
    });

    const controller = new InteractionChainController(openai);

    const result = await controller.interview(
      messages,
      constructionalProgramMock.targetOutcome,
    );

    expect(result).toEqual(validCompletedResponse);
    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("throws InterviewPhaseValidationError when OpenAI returns an invalid interaction chain", async () => {
    const invalidResponse = {
      phaseComplete: true,
      interactionChain: {
        ...validCompletedResponse.interactionChain,
        steps: [
          {
            ...validCompletedResponse.interactionChain.steps[0],

            // Deliberately violate the schema.
            requiresTransfer: "yes",
          },
        ],
      },
    };

    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(invalidResponse),
    });

    const controller = new InteractionChainController(openai);

    await expect(
      controller.interview(messages, constructionalProgramMock.targetOutcome),
    ).rejects.toMatchObject({
      name: "InterviewPhaseValidationError",
      code: "INTERVIEW_PHASE_VALIDATION_FAILED",
      phase: "interaction_chain",
    });

    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("adds validation feedback to the OpenAI request when validation issues are supplied", async () => {
    const validationIssues = createValidationIssues();

    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(validCompletedResponse),
    });

    const controller = new InteractionChainController(openai);

    await controller.interview(
      messages,
      constructionalProgramMock.targetOutcome,
      validationIssues,
    );

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

    expect(correctionMessage.content).toContain("requiresTransfer");

    expect(correctionMessage.content).toContain(validationIssues[0].message);
  });
});
