import { z } from "zod";

export const controlAnalysisSchema = z.object({
  targetPattern: z.string(),

  initialConditions: z.object({
    description: z.string(),
    behaviorObserved: z.string(),
    controllingConditions: z.array(z.string()),
    relevantReinforcer: z.string(),
    evidence: z.array(z.string()),
  }),

  transitionPoint: z.object({
    stepIndex: z.number().int().nonnegative(),
    changedCondition: z.string(),
  }),

  disturbingPattern: z.string(),

  terminalConditions: z.object({
    description: z.string(),
    targetPattern: z.string(),
  }),
});

export type ControlAnalysis = z.infer<typeof controlAnalysisSchema>;
