"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programPhaseSchema = exports.approximationSchema = void 0;
const zod_1 = require("zod");
exports.approximationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    order: zod_1.z.number().int().nonnegative(),
    conditions: zod_1.z.array(zod_1.z.string()),
    changeFromPrevious: zod_1.z.object({
        dimension: zod_1.z.string(),
        adjustment: zod_1.z.string(),
    }),
    targetPattern: zod_1.z.string(),
    reinforcer: zod_1.z.string(),
    controlCriterion: zod_1.z.object({
        evidenceOfControl: zod_1.z.string(),
        sufficientToAdvance: zod_1.z.string(),
    }),
    recovery: zod_1.z.object({
        reduceApproximationTo: zod_1.z.string().optional(),
        previousSuccessfulApproximationId: zod_1.z.string().optional(),
    }),
});
exports.programPhaseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    order: zod_1.z.number().int().nonnegative(),
    title: zod_1.z.string(),
    entryCondition: zod_1.z.string(),
    targetPattern: zod_1.z.string(),
    terminalCriterion: zod_1.z.string(),
    reinforcers: zod_1.z.array(zod_1.z.string()),
    notes: zod_1.z.string().optional(),
    approximations: zod_1.z.array(exports.approximationSchema),
});
