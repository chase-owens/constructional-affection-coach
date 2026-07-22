import { z } from "zod";
import { approximationSchema } from "./transfer-step";

const legacyApproximationSchema = z.object({
  index: z.number().int().nonnegative(),
  dimension: z.string(),
  adjustment: z.string(),
  targetPattern: z.string(),
  successCriterion: z.string(),
});

export const programStageSchema = z.object({
  index: z.number().int().nonnegative(),
  title: z.string(),
  targetPattern: z.string(),
  interactionStepIndex: z.number().int().nonnegative().optional(),
  entryCondition: z.string(),
  successCriterion: z.string(),
  reinforcers: z.array(z.string()),
  approximations: z.array(legacyApproximationSchema),
  notes: z.string().optional(),
});

/**
 * Legacy shape currently returned by OpenAI.
 */
export const legacyProgramInitializationSchema = z.object({
  startingPoint: z.string(),
  terminalTargetPattern: z.string(),
  programStages: z.array(programStageSchema),
  rationale: z.string(),
  notes: z.string().optional(),
});

/**
 * Shape stored inside ConstructionalProgram.
 */
export const programInitializationSchema = z.object({
  initialApproximation: approximationSchema,
  readinessCriterion: z.string(),
});

export const programInitializationPhaseResultSchema = z.object({
  phaseComplete: z.literal(true),
  programInitialization: legacyProgramInitializationSchema,
  coachMessage: z.string().optional(),
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

export type LegacyApproximation = z.infer<typeof legacyApproximationSchema>;

export type ProgramStage = z.infer<typeof programStageSchema>;

export type LegacyProgramInitialization = z.infer<
  typeof legacyProgramInitializationSchema
>;

export type ProgramInitialization = z.infer<typeof programInitializationSchema>;

export type ProgramInitializationPhaseResult = z.infer<
  typeof programInitializationPhaseResultSchema
>;

export type InteractionGuidelines = z.infer<typeof interactionGuidelinesSchema>;

export type AffectionLoop = z.infer<typeof affectionLoopSchema>;
