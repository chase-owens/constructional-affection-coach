import { z } from "zod";
import { nonEmptyStringSchema } from "./shared.js";

export const startingInteractionSchema = z.object({
  conditions: z.array(z.string()).min(1),
  targetPattern: nonEmptyStringSchema,
  reinforcer: nonEmptyStringSchema,
  controlCriterion: nonEmptyStringSchema,
});

export const programInitializationSchema = z.object({
  startingInteraction: startingInteractionSchema,
  readinessCriterion: nonEmptyStringSchema,
});

// Future possible schema

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
