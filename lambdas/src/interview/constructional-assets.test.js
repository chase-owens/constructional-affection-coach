"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const errors_1 = require("../program/errors");
const mocks = vitest_1.vi.hoisted(() => ({
    interview: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("./controllers/constructional-assets", () => ({
    ConstructionalAssetsController: class {
        interview = mocks.interview;
    },
}));
const constructional_assets_1 = require("./constructional-assets");
const openai = {};
const messages = [
    {
        role: "coach",
        content: "What does your dog already enjoy from you?",
    },
    {
        role: "user",
        content: "She really likes petting, scratches, and when I talk to her.",
    },
];
const validResult = {
    phaseComplete: true,
    constructionalAssets: {
        socialReinforcers: {
            touch: "clearly_reinforcing",
            talk: "clearly_reinforcing",
            eyeContact: "unclear",
            proximity: "unclear",
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
        notes: "Touch and talk appear useful for supporting the target interaction.",
    },
};
const createValidationError = () => {
    const schema = zod_1.z.object({
        touch: zod_1.z.enum([
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
    return new errors_1.InterviewPhaseValidationError("constructional_assets", result.error);
};
(0, vitest_1.describe)("runConstructionalAssetsInterview", () => {
    (0, vitest_1.beforeEach)(() => {
        mocks.interview.mockReset();
    });
    (0, vitest_1.it)("returns without retrying when the first attempt is valid", async () => {
        mocks.interview.mockResolvedValueOnce(validResult);
        const result = await (0, constructional_assets_1.runConstructionalAssetsInterview)(openai, messages);
        (0, vitest_1.expect)(result).toEqual(validResult);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledWith(messages, undefined);
    });
    (0, vitest_1.it)("retries with validation issues when the first attempt fails validation", async () => {
        const validationError = createValidationError();
        mocks.interview
            .mockRejectedValueOnce(validationError)
            .mockResolvedValueOnce(validResult);
        const result = await (0, constructional_assets_1.runConstructionalAssetsInterview)(openai, messages);
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
        await (0, vitest_1.expect)((0, constructional_assets_1.runConstructionalAssetsInterview)(openai, messages)).rejects.toBe(secondValidationError);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(mocks.interview.mock.calls[1]).toEqual([
            messages,
            firstValidationError.validationError.issues,
        ]);
    });
    (0, vitest_1.it)("does not retry non-validation errors", async () => {
        const error = new Error("OpenAI request failed");
        mocks.interview.mockRejectedValueOnce(error);
        await (0, vitest_1.expect)((0, constructional_assets_1.runConstructionalAssetsInterview)(openai, messages)).rejects.toBe(error);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledOnce();
    });
});
