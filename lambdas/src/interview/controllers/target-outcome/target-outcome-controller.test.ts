import { beforeEach, describe, expect, it, vi } from "vitest";
import type OpenAI from "openai";
import { z } from "zod";

import { InterviewPhaseValidationError } from "../../../program/errors";
import type { ValidationIssue } from "../../../validation/types";
import { TargetOutcomeController } from "./target-outcome-controller";

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
    content:
      "Assuming this process is successful, what would you want to see happening?",
  },
  {
    role: "user" as const,
    content: "I want my dog calm while I sit on the couch.",
  },
];

const validCompletedResponse = {
  coachMessage: "Great, that gives us a clear target.",
  phaseComplete: true,
  targetOutcome: {
    targetActions: ["sitting", "lying down"],
    rawAnswer: "I want my dog calm while I sit on the couch.",
    clarifiedOutcome:
      "The dog sits or lies calmly while the person sits on the couch.",
    desiredInteractionPattern:
      "Dog remains sitting or lying calmly near the couch.",
    primaryContext: "Sitting on the couch at home",
    scope: "within_constructional_affection",
    isPositive: true,
    isObservable: true,
    notes: "Calm position changes are allowed.",
  },
};

const createValidationIssues = (): ValidationIssue[] => {
  const schema = z.object({
    isPositive: z.boolean(),
  });

  const result = schema.safeParse({
    isPositive: "yes",
  });

  if (result.success) {
    throw new Error("Expected validation fixture to fail.");
  }

  return result.error.issues;
};

describe("TargetOutcomeController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a valid target outcome response from OpenAI", async () => {
    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(validCompletedResponse),
    });

    const controller = new TargetOutcomeController(openai);

    const result = await controller.interview(messages);

    expect(result).toEqual(validCompletedResponse);

    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("throws InterviewPhaseValidationError when OpenAI returns an invalid target outcome", async () => {
    const invalidResponse = {
      coachMessage: "Great, that gives us a clear target.",
      phaseComplete: true,
      targetOutcome: {
        ...validCompletedResponse.targetOutcome,

        // Deliberately violate the target outcome schema.
        isPositive: "yes",
      },
    };

    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(invalidResponse),
    });

    const controller = new TargetOutcomeController(openai);

    await expect(controller.interview(messages)).rejects.toMatchObject({
      name: "InterviewPhaseValidationError",
      code: "INTERVIEW_PHASE_VALIDATION_FAILED",
      phase: "target_outcome",
    });

    expect(mocks.create).toHaveBeenCalledOnce();
  });

  it("adds validation feedback to the OpenAI request when validation issues are supplied", async () => {
    const validationIssues = createValidationIssues();

    mocks.create.mockResolvedValueOnce({
      output_text: JSON.stringify(validCompletedResponse),
    });

    const controller = new TargetOutcomeController(openai);

    await controller.interview(messages, validationIssues);

    expect(mocks.create).toHaveBeenCalledOnce();

    const request = mocks.create.mock.calls[0][0];

    expect(request.input).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: "system",
          content: expect.stringContaining(
            "The previous response failed schema validation.",
          ),
        }),
      ]),
    );

    const correctionMessage = request.input.find(
      (item: { role: string; content: string }) =>
        item.role === "system" &&
        item.content.includes(
          "The previous response failed schema validation.",
        ),
    );

    expect(correctionMessage).toBeDefined();

    expect(correctionMessage.content).toContain("isPositive");

    expect(correctionMessage.content).toContain("expected boolean");
  });
});
