import { z } from "zod";

export const approximationSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),

  conditions: z.array(z.string()),

  changeFromPrevious: z.object({
    dimension: z.string(),
    adjustment: z.string(),
  }),

  targetPattern: z.string(),
  reinforcer: z.string(),

  controlCriterion: z.object({
    evidenceOfControl: z.string(),
    sufficientToAdvance: z.string(),
  }),

  recovery: z.object({
    reduceApproximationTo: z.string().optional(),
    previousSuccessfulApproximationId: z.string().optional(),
  }),
});

export const programPhaseSchema = z.object({
  id: z.string(),
  order: z.number().int().nonnegative(),
  title: z.string(),
  entryCondition: z.string(),
  targetPattern: z.string(),
  terminalCriterion: z.string(),
  reinforcers: z.array(z.string()),
  notes: z.string().optional(),
  approximations: z.array(approximationSchema),
});

export type Approximation = z.infer<typeof approximationSchema>;

export type ProgramPhase = z.infer<typeof programPhaseSchema>;
