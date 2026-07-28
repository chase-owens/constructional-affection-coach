import { z } from "zod";

export const evaluationResultSchema = z.object({
  valid: z.boolean(),
  issues: z.array(z.string().trim().min(1)),
});

export type EvaluationResult = z.infer<typeof evaluationResultSchema>;
