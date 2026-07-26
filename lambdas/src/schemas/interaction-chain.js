"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_INTERACTION_QUESTION = exports.interactionChainPhaseResultSchema = exports.interactionChainSchema = exports.interactionStepSchema = exports.interactionStepActorSchema = void 0;
const zod_1 = require("zod");
exports.interactionStepActorSchema = zod_1.z.enum([
    "person",
    "dog",
    "environment",
]);
exports.interactionStepSchema = zod_1.z.object({
    index: zod_1.z.number().int().nonnegative(),
    actor: exports.interactionStepActorSchema,
    description: zod_1.z.string(),
    change: zod_1.z.string(),
    expectedDogBehavior: zod_1.z.string().optional(),
    targetPatternPresent: zod_1.z.union([zod_1.z.boolean(), zod_1.z.literal("unknown")]),
    requiresTransfer: zod_1.z.boolean(),
    notes: zod_1.z.string().optional(),
});
exports.interactionChainSchema = zod_1.z.object({
    steps: zod_1.z.array(exports.interactionStepSchema),
    constructionStartIndex: zod_1.z.number().int().nonnegative(),
    targetOutcomeIndex: zod_1.z.number().int().nonnegative(),
    notes: zod_1.z.string(),
});
exports.interactionChainPhaseResultSchema = zod_1.z.union([
    zod_1.z.object({
        coachMessage: zod_1.z.string(),
        phaseComplete: zod_1.z.literal(false),
    }),
    zod_1.z.object({
        phaseComplete: zod_1.z.literal(true),
        interactionChain: exports.interactionChainSchema,
        coachMessage: zod_1.z.string().optional(),
    }),
]);
exports.INITIAL_INTERACTION_QUESTION = "How does what we want to happen differ from what is currently happening? What does the chain look like today?";
