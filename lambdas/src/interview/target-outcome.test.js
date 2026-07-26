"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const errors_1 = require("../program/errors");
const mocks = vitest_1.vi.hoisted(() => ({
    interview: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("./controllers/target-outcome", () => ({
    TargetOutcomeController: class {
        interview = mocks.interview;
    },
}));
const target_outcome_1 = require("./target-outcome");
const openai = {};
const messages = [
    {
        role: "coach",
        content: "Assuming this process is successful, what would you want to see happening?",
    },
    {
        role: "user",
        content: "I want my dog to remain calm while I sit on the couch.",
    },
];
const validResult = {
    coachMessage: "Tell me a little more about what calm would look like.",
    phaseComplete: false,
};
const createValidationError = () => {
    const schema = zod_1.z.object({
        phaseComplete: zod_1.z.boolean(),
    });
    const result = schema.safeParse({
        phaseComplete: "yes",
    });
    if (result.success) {
        throw new Error("Expected test fixture to fail validation.");
    }
    return new errors_1.InterviewPhaseValidationError("target_outcome", result.error);
};
(0, vitest_1.describe)("runTargetOutcomeInterview", () => {
    (0, vitest_1.beforeEach)(() => {
        mocks.interview.mockReset();
    });
    (0, vitest_1.it)("returns without retrying when the first attempt is valid", async () => {
        mocks.interview.mockResolvedValueOnce(validResult);
        const result = await (0, target_outcome_1.runTargetOutcomeInterview)(openai, messages);
        (0, vitest_1.expect)(result).toEqual(validResult);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledWith(messages, undefined);
    });
    (0, vitest_1.it)("retries with validation issues when the first attempt fails validation", async () => {
        const validationError = createValidationError();
        mocks.interview
            .mockRejectedValueOnce(validationError)
            .mockResolvedValueOnce(validResult);
        const result = await (0, target_outcome_1.runTargetOutcomeInterview)(openai, messages);
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
        await (0, vitest_1.expect)((0, target_outcome_1.runTargetOutcomeInterview)(openai, messages)).rejects.toBe(secondValidationError);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledTimes(2);
        (0, vitest_1.expect)(mocks.interview.mock.calls[1]).toEqual([
            messages,
            firstValidationError.validationError.issues,
        ]);
    });
    (0, vitest_1.it)("does not retry non-validation errors", async () => {
        const error = new Error("OpenAI request failed");
        mocks.interview.mockRejectedValueOnce(error);
        await (0, vitest_1.expect)((0, target_outcome_1.runTargetOutcomeInterview)(openai, messages)).rejects.toBe(error);
        (0, vitest_1.expect)(mocks.interview).toHaveBeenCalledOnce();
    });
});
