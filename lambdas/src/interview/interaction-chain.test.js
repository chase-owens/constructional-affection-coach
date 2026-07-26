"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const errors_1 = require("../program/errors");
const mocks = vitest_1.vi.hoisted(() => ({
    interview: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("./controllers/interaction-chain", () => ({
    InteractionChainController: class {
        interview = mocks.interview;
    },
}));
const interaction_chain_1 = require("./interaction-chain");
const openai = {};
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
const validResult = {
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
const createValidationError = () => {
    const schema = zod_1.z.object({
        phaseComplete: zod_1.z.boolean(),
    });
    const result = schema.safeParse({
        phaseComplete: "yes",
    });
    if (result.success) {
        throw new Error("Expected validation fixture to fail.");
    }
    return new errors_1.InterviewPhaseValidationError("interaction_chain", result.error);
};
(0, vitest_1.describe)("runInteractionChainInterview", () => {
    (0, vitest_1.beforeEach)(() => {
        mocks.interview.mockReset();
    });
    (0, vitest_1.it)("returns without retrying when the first attempt is valid", async () => {
        mocks.interview.mockResolvedValueOnce(validResult);
        const result = await (0, interaction_chain_1.runInteractionChainInterview)(openai, messages);
        (0, vitest_1.expect)(result).toEqual(validResult);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledWith(messages, undefined);
    });
    (0, vitest_1.it)("retries with validation issues when the first attempt fails validation", async () => {
        const validationError = createValidationError();
        mocks.interview
            .mockRejectedValueOnce(validationError)
            .mockResolvedValueOnce(validResult);
        const result = await (0, interaction_chain_1.runInteractionChainInterview)(openai, messages);
        (0, vitest_1.expect)(result).toEqual(validResult);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(mocks.interview.mock.calls[0]).toEqual([messages, undefined]);
        (0, vitest_1.expect)(mocks.interview.mock.calls[1]).toEqual([
            messages,
            validationError.validationError.issues,
        ]);
    });
    (0, vitest_1.it)("throws after both attempts fail validation", async () => {
        const firstValidationError = createValidationError();
        const secondValidationError = createValidationError();
        mocks.interview
            .mockRejectedValueOnce(firstValidationError)
            .mockRejectedValueOnce(secondValidationError);
        await (0, vitest_1.expect)((0, interaction_chain_1.runInteractionChainInterview)(openai, messages)).rejects.toBe(secondValidationError);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(mocks.interview.mock.calls[1]).toEqual([
            messages,
            firstValidationError.validationError.issues,
        ]);
    });
    (0, vitest_1.it)("does not retry non-validation errors", async () => {
        const error = new Error("OpenAI request failed");
        mocks.interview.mockRejectedValueOnce(error);
        await (0, vitest_1.expect)((0, interaction_chain_1.runInteractionChainInterview)(openai, messages)).rejects.toBe(error);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledOnce();
    });
});
