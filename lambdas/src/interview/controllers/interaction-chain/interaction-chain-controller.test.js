"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const interaction_chain_controller_1 = require("./interaction-chain-controller");
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
        content: "What happens immediately before the interaction changes?",
    },
    {
        role: "user",
        content: "My dog is calm while I am standing, but starts moving toward me when I begin sitting down.",
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
const createValidationIssues = () => {
    const schema = zod_1.z.object({
        requiresTransfer: zod_1.z.boolean(),
    });
    const result = schema.safeParse({
        requiresTransfer: "yes",
    });
    if (result.success) {
        throw new Error("Expected validation fixture to fail.");
    }
    return result.error.issues;
};
(0, vitest_1.describe)("InteractionChainController", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns a valid interaction chain response from OpenAI", async () => {
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(validCompletedResponse),
        });
        const controller = new interaction_chain_controller_1.InteractionChainController(openai);
        const result = await controller.interview(messages);
        (0, vitest_1.expect)(result).toEqual(validCompletedResponse);
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("throws InterviewPhaseValidationError when OpenAI returns an invalid interaction chain", async () => {
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
        const controller = new interaction_chain_controller_1.InteractionChainController(openai);
        await (0, vitest_1.expect)(controller.interview(messages)).rejects.toMatchObject({
            name: "InterviewPhaseValidationError",
            code: "INTERVIEW_PHASE_VALIDATION_FAILED",
            phase: "interaction_chain",
        });
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("adds validation feedback to the OpenAI request when validation issues are supplied", async () => {
        const validationIssues = createValidationIssues();
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(validCompletedResponse),
        });
        const controller = new interaction_chain_controller_1.InteractionChainController(openai);
        await controller.interview(messages, validationIssues);
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
        const request = mocks.create.mock.calls[0][0];
        const correctionMessage = request.input.find((item) => item.role === "system" &&
            item.content.includes("The previous response failed schema validation."));
        (0, vitest_1.expect)(correctionMessage).toBeDefined();
        (0, vitest_1.expect)(correctionMessage.content).toContain("requiresTransfer");
        (0, vitest_1.expect)(correctionMessage.content).toContain(validationIssues[0].message);
    });
});
