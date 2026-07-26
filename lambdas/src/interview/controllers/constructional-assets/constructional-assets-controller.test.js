"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const constructional_assets_controller_1 = require("./constructional-assets-controller");
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
        content: "What does your dog already enjoy from you?",
    },
    {
        role: "user",
        content: "She really likes petting, scratches, and when I talk to her.",
    },
];
const validCompletedResponse = {
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
const createValidationIssues = () => {
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
    return result.error.issues;
};
(0, vitest_1.describe)("ConstructionalAssetsController", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns a valid constructional assets response from OpenAI", async () => {
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(validCompletedResponse),
        });
        const controller = new constructional_assets_controller_1.ConstructionalAssetsController(openai);
        const result = await controller.interview(messages);
        (0, vitest_1.expect)(result).toEqual(validCompletedResponse);
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("throws InterviewPhaseValidationError when OpenAI returns invalid constructional assets", async () => {
        const invalidResponse = {
            phaseComplete: true,
            constructionalAssets: {
                ...validCompletedResponse.constructionalAssets,
                socialReinforcers: {
                    ...validCompletedResponse.constructionalAssets.socialReinforcers,
                    // Deliberately violate the schema.
                    touch: "really_likes_it",
                },
            },
        };
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(invalidResponse),
        });
        const controller = new constructional_assets_controller_1.ConstructionalAssetsController(openai);
        await (0, vitest_1.expect)(controller.interview(messages)).rejects.toMatchObject({
            name: "InterviewPhaseValidationError",
            code: "INTERVIEW_PHASE_VALIDATION_FAILED",
            phase: "constructional_assets",
        });
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
    });
    (0, vitest_1.it)("adds validation feedback to the OpenAI request when validation issues are supplied", async () => {
        const validationIssues = createValidationIssues();
        mocks.create.mockResolvedValueOnce({
            output_text: JSON.stringify(validCompletedResponse),
        });
        const controller = new constructional_assets_controller_1.ConstructionalAssetsController(openai);
        await controller.interview(messages, validationIssues);
        (0, vitest_1.expect)(mocks.create).toHaveBeenCalledOnce();
        const request = mocks.create.mock.calls[0][0];
        const correctionMessage = request.input.find((item) => item.role === "system" &&
            item.content.includes("The previous response failed schema validation."));
        (0, vitest_1.expect)(correctionMessage).toBeDefined();
        (0, vitest_1.expect)(correctionMessage.content).toContain("touch");
        (0, vitest_1.expect)(correctionMessage.content).toContain(validationIssues[0].message);
    });
});
