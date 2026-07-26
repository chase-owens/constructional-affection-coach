"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.targetOutcomePhaseResultSchema = exports.targetOutcomeSchema = void 0;
const zod_1 = require("zod");
exports.targetOutcomeSchema = zod_1.z.object({
    rawAnswer: zod_1.z.string(),
    clarifiedOutcome: zod_1.z.string(),
    desiredInteractionPattern: zod_1.z.string(),
    primaryContext: zod_1.z.string().nullable(),
    scope: zod_1.z.enum([
        "within_constructional_affection",
        "outside_constructional_affection",
        "needs_clarification",
    ]),
    isPositive: zod_1.z.boolean(),
    isObservable: zod_1.z.boolean(),
    notes: zod_1.z.string().optional(),
});
exports.targetOutcomePhaseResultSchema = zod_1.z.union([
    zod_1.z.object({
        coachMessage: zod_1.z.string(),
        phaseComplete: zod_1.z.literal(false),
    }),
    zod_1.z.object({
        coachMessage: zod_1.z.string(),
        phaseComplete: zod_1.z.literal(true),
        targetOutcome: exports.targetOutcomeSchema,
    }),
    zod_1.z.object({
        coachMessage: zod_1.z.string(),
        phaseComplete: zod_1.z.literal(true),
        outsideScope: zod_1.z.literal(true),
        reason: zod_1.z.string(),
    }),
]);
