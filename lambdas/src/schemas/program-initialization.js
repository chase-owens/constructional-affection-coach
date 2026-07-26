"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.affectionLoopSchema = exports.interactionGuidelinesSchema = exports.programInitializationSchema = exports.startingInteractionSchema = void 0;
const zod_1 = require("zod");
exports.startingInteractionSchema = zod_1.z.object({
    conditions: zod_1.z.array(zod_1.z.string()).min(1),
    targetPattern: zod_1.z.string(),
    reinforcer: zod_1.z.string(),
    controlCriterion: zod_1.z.string(),
});
exports.programInitializationSchema = zod_1.z.object({
    startingInteraction: exports.startingInteractionSchema,
    readinessCriterion: zod_1.z.string(),
});
exports.interactionGuidelinesSchema = zod_1.z.object({
    oneHandRule: zod_1.z.string(),
    stopRule: zod_1.z.string(),
    resumeRule: zod_1.z.string(),
    twoHandRule: zod_1.z.string(),
});
exports.affectionLoopSchema = zod_1.z.object({
    startingLoop: zod_1.z.string(),
    advanceRule: zod_1.z.string(),
    resetRule: zod_1.z.string(),
    transferRule: zod_1.z.string(),
});
