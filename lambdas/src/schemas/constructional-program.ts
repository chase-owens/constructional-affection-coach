import { z } from "zod";

import { targetOutcomeSchema } from "./target-outcome";
import { constructionalAssetsSchema } from "./constructional-assets";
import { controlAnalysisSchema } from "./control-analysis";
import { programPhaseSchema } from "./transfer-step";
import { programInitializationSchema } from "./program-initialization";

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
