"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONSTRUCTIONAL_ASSETS = exports.constructionalAssetsPhaseResultSchema = exports.constructionalAssetsSchema = exports.relevantConditionSchema = exports.relevantSkillSchema = exports.socialReinforcersSchema = exports.reinforcerStatusSchema = void 0;
const zod_1 = require("zod");
exports.reinforcerStatusSchema = zod_1.z.enum([
    "clearly_reinforcing",
    "sometimes_reinforcing",
    "unclear",
    "not_reinforcing",
    "over_arousing",
]);
exports.socialReinforcersSchema = zod_1.z.object({
    touch: exports.reinforcerStatusSchema,
    talk: exports.reinforcerStatusSchema,
    eyeContact: exports.reinforcerStatusSchema,
    proximity: exports.reinforcerStatusSchema,
});
exports.relevantSkillSchema = zod_1.z.object({
    name: zod_1.z.string(),
    context: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
exports.relevantConditionSchema = zod_1.z.object({
    description: zod_1.z.string(),
    behaviorObserved: zod_1.z.string(),
    notes: zod_1.z.string().optional(),
});
exports.constructionalAssetsSchema = zod_1.z.object({
    socialReinforcers: exports.socialReinforcersSchema,
    relevantSkills: zod_1.z.array(exports.relevantSkillSchema),
    conditionsWhereTargetPatternOccurs: zod_1.z.array(exports.relevantConditionSchema),
    notes: zod_1.z.string().optional(),
});
exports.constructionalAssetsPhaseResultSchema = zod_1.z.union([
    zod_1.z.object({
        coachMessage: zod_1.z.string(),
        phaseComplete: zod_1.z.literal(false),
    }),
    zod_1.z.object({
        phaseComplete: zod_1.z.literal(true),
        constructionalAssets: exports.constructionalAssetsSchema,
        coachMessage: zod_1.z.string().optional(),
    }),
]);
exports.DEFAULT_CONSTRUCTIONAL_ASSETS = {
    socialReinforcers: {
        touch: "unclear",
        talk: "unclear",
        eyeContact: "unclear",
        proximity: "unclear",
    },
    relevantSkills: [],
    conditionsWhereTargetPatternOccurs: [],
};
