import { z } from "zod";

const approximationSchema = z.object({
  index: z.number(),
  dimension: z.string(),
  adjustment: z.string(),
  targetPattern: z.string(),
  successCriterion: z.string(),
});

export const programStageSchema = z.object({
  index: z.number(),
  title: z.string(),
  targetPattern: z.string(),
  entryCondition: z.string(),
  successCriterion: z.string(),
  reinforcers: z.array(z.string()),
  approximations: z.array(approximationSchema),
  notes: z.string().optional(),
});

const programInitializationSchema = z.object({
  startingPoint: z.string(),
  terminalTargetPattern: z.string(),
  programStages: z.array(programStageSchema),
  rationale: z.string(),
  notes: z.string().optional(),
});

export const programInitializationPhaseResultSchema = z.object({
  phaseComplete: z.literal(true),
  programInitialization: programInitializationSchema,
  coachMessage: z.string().optional(),
});

export const interactionGuidelines = z.object({
  oneHandRule: z.string(),
  stopRule: z.string(),
  resumeRule: z.string(),
  twoHandRule: z.string(),
});

export const affectionLoop = z.object({
  startingLoop: z.string(),
  advanceRule: z.string(),
  resetRule: z.string(),
  transferRule: z.string(),
});

export type ProgramInitializationPhaseResult = z.infer<
  typeof programInitializationPhaseResultSchema
>;
