import { z } from "zod";
import { nonEmptyStringSchema } from "./shared.js";

export const interactionStepActorSchema = z.enum([
  "person",
  "dog",
  "environment",
]);

export const interactionStepSchema = z.object({
  index: z.number().int().nonnegative(),
  actor: interactionStepActorSchema,
  description: nonEmptyStringSchema,
  change: nonEmptyStringSchema,
  expectedDogBehavior: z.string().optional(),
  targetPatternPresent: z.union([z.boolean(), z.literal("unknown")]),
  requiresTransfer: z.boolean(),
  notes: z.string().optional(),
});

export const interactionChainSchema = z.object({
  steps: z.array(interactionStepSchema).min(2),
  constructionStartIndex: z.number().int().nonnegative(),
  targetOutcomeIndex: z.number().int().nonnegative(),
  notes: z.string(),
});

export const interactionChainPhaseResultSchema = z.union([
  z.object({
    coachMessage: nonEmptyStringSchema,
    phaseComplete: z.literal(false),
  }),
  z.object({
    phaseComplete: z.literal(true),
    interactionChain: interactionChainSchema,
    coachMessage: z.string().optional(),
  }),
]);

export type InteractionStepActor = z.infer<typeof interactionStepActorSchema>;

export type InteractionStep = z.infer<typeof interactionStepSchema>;

export type InteractionChain = z.infer<typeof interactionChainSchema>;

export type InteractionChainPhaseResult = z.infer<
  typeof interactionChainPhaseResultSchema
>;

export const INITIAL_INTERACTION_QUESTION =
  "How does what we want to happen differ from what is currently happening? What does the chain look like today?";
