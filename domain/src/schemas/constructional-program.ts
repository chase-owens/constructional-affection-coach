import { z } from "zod";

import {
  constructionalAssetsSchema,
  targetOutcomeSchema,
} from "@constructional-affection/domain";
import { controlAnalysisSchema } from "./control-analysis.js";
import { programPhaseSchema } from "./transfer-step.js";
import { programInitializationSchema } from "./program-initialization.js";

export const constructionalProgramSchema = z.object({
  schemaVersion: z.literal("1.0"),

  targetOutcome: targetOutcomeSchema,
  constructionalAssets: constructionalAssetsSchema,
  controlAnalysis: controlAnalysisSchema,
  initialization: programInitializationSchema,

  transferPlan: z.object({
    phases: z.array(programPhaseSchema),
    terminalCriterion: z.string(),
  }),
});

export type ConstructionalProgram = z.infer<typeof constructionalProgramSchema>;
