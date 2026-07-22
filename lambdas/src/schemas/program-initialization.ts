import { z } from "zod";
import { approximationSchema } from "./transfer-step";

/**
 * Shape stored inside ConstructionalProgram.
 */
export const programInitializationSchema = z.object({
  initialApproximation: approximationSchema,
  readinessCriterion: z.string(),
});

export const interactionGuidelinesSchema = z.object({
  oneHandRule: z.string(),
  stopRule: z.string(),
  resumeRule: z.string(),
  twoHandRule: z.string(),
});

export const affectionLoopSchema = z.object({
  startingLoop: z.string(),
  advanceRule: z.string(),
  resetRule: z.string(),
  transferRule: z.string(),
});

export type ProgramInitialization = z.infer<typeof programInitializationSchema>;

export type InteractionGuidelines = z.infer<typeof interactionGuidelinesSchema>;

export type AffectionLoop = z.infer<typeof affectionLoopSchema>;
