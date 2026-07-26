"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructionalProgramSchema = void 0;
const zod_1 = require("zod");
const target_outcome_1 = require("./target-outcome");
const constructional_assets_1 = require("./constructional-assets");
const control_analysis_1 = require("./control-analysis");
const transfer_step_1 = require("./transfer-step");
const program_initialization_1 = require("./program-initialization");
exports.constructionalProgramSchema = zod_1.z.object({
    schemaVersion: zod_1.z.literal("1.0"),
    targetOutcome: target_outcome_1.targetOutcomeSchema,
    constructionalAssets: constructional_assets_1.constructionalAssetsSchema,
    controlAnalysis: control_analysis_1.controlAnalysisSchema,
    initialization: program_initialization_1.programInitializationSchema,
    transferPlan: zod_1.z.object({
        phases: zod_1.z.array(transfer_step_1.programPhaseSchema),
        terminalCriterion: zod_1.z.string(),
    }),
});
