import { z } from "zod";

export const startingInteractionSchema = z.object({
  conditions: z.array(z.string()).min(1),
  targetPattern: z.string(),
  reinforcer: z.string(),
  controlCriterion: z.string(),
});

export const programInitializationSchema = z.object({
  startingInteraction: startingInteractionSchema,
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

export type StartingInteraction = z.infer<typeof startingInteractionSchema>;

export type ProgramInitialization = z.infer<typeof programInitializationSchema>;

export type InteractionGuidelines = z.infer<typeof interactionGuidelinesSchema>;

export type AffectionLoop = z.infer<typeof affectionLoopSchema>;
