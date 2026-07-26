"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlAnalysisSchema = void 0;
const zod_1 = require("zod");
exports.controlAnalysisSchema = zod_1.z.object({
    targetPattern: zod_1.z.string(),
    initialConditions: zod_1.z.object({
        description: zod_1.z.string(),
        behaviorObserved: zod_1.z.string(),
        controllingConditions: zod_1.z.array(zod_1.z.string()),
        relevantReinforcer: zod_1.z.string(),
        evidence: zod_1.z.array(zod_1.z.string()),
    }),
    transitionPoint: zod_1.z.object({
        stepIndex: zod_1.z.number().int().nonnegative(),
        changedCondition: zod_1.z.string(),
    }),
    disturbingPattern: zod_1.z.string(),
    terminalConditions: zod_1.z.object({
        description: zod_1.z.string(),
        targetPattern: zod_1.z.string(),
    }),
});
