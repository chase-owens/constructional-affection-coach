"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const target_outcome_controller_1 = require("./target-outcome-controller");
const mocks = vitest_1.vi.hoisted(() => ({
    create: vitest_1.vi.fn(),
}));
const openai = {
    responses: {
        create: mocks.create,
    },
};
const messages = [
    {
        role: "coach",
        content: "Assuming this process is successful, what would you want to see happening?",
    },
    {
        role: "user",
        content: "I want my dog calm while I sit on the couch.",
    },
];
const validCompletedResponse = {
    coachMessage: "Great, that gives us a clear target.",
    phaseComplete: true,
    targetOutcome: {
        rawAnswer: "I want my dog calm while I sit on the couch.",
        clarifiedOutcome: "The dog sits or lies calmly while the person sits on the couch.",
        desiredInteractionPattern: "Dog remains sitting or lying calmly near the couch.",
        primaryContext: "Sitting on the couch at home",
        scope: "within_constructional_affection",
        isPositive: true,
        isObservable: true,
        notes: "Calm position changes are allowed.",
    },
};
const createValidationIssues = () => {
    const schema = zod_1.z.object({
        isPositive: zod_1.z.boolean(),
    });
    const result = schema.safeParse({
        isPositive: "yes",
    });
    if (result.success) {
        throw new Error("Expected validation fixture to fail.");
    }
    return result.error.issues;
};
(0, vitest_1.describe)("TargetOutcomeController", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns a valid target outcome response from OpenAI", async () => {
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(validCompletedResponse),
        });
        const controller = new target_outcome_controller_1.TargetOutcomeController(openai);
        const result = await controller.interview(messages);
        (0, vitest_1.expect)(result).toEqual(validCompletedResponse);
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("throws InterviewPhaseValidationError when OpenAI returns an invalid target outcome", async () => {
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
        const controller = new target_outcome_controller_1.TargetOutcomeController(openai);
        await (0, vitest_1.expect)(controller.interview(messages)).rejects.toMatchObject({
            name: "InterviewPhaseValidationError",
            code: "INTERVIEW_PHASE_VALIDATION_FAILED",
            phase: "target_outcome",
        });
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("adds validation feedback to the OpenAI request when validation issues are supplied", async () => {
        const validationIssues = createValidationIssues();
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(validCompletedResponse),
        });
        const controller = new target_outcome_controller_1.TargetOutcomeController(openai);
        await controller.interview(messages, validationIssues);
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
        const request = mocks.create.mock.calls[0][0];
        (0, vitest_1.expect)(request.input).toEqual(vitest_1.expect.arrayContaining([
            vitest_1.expect.objectContaining({
                role: "system",
                content: vitest_1.expect.stringContaining("The previous response failed schema validation."),
            }),
        ]));
        const correctionMessage = request.input.find((item) => item.role === "system" &&
            item.content.includes("The previous response failed schema validation."));
        (0, vitest_1.expect)(correctionMessage).toBeDefined();
        (0, vitest_1.expect)(correctionMessage.content).toContain("isPositive");
        (0, vitest_1.expect)(correctionMessage.content).toContain("expected boolean");
    });
});
