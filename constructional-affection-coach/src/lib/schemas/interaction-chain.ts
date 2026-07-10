import { z } from 'zod';

export const interactionStepSchema = z.object({
	index: z.number(),
	actor: z.enum(['person', 'dog', 'environment']),
	description: z.string(),
	change: z.string(),
	expectedDogBehavior: z.string().optional(),
	targetPatternPresent: z.union([z.boolean(), z.literal('unknown')]),
	requiresTransfer: z.boolean(),
	notes: z.string().optional()
});

const interactionChainSchema = z.object({
	steps: z.array(interactionStepSchema),
	constructionStartIndex: z.number(),
	targetOutcomeIndex: z.number(),
	notes: z.string()
});

export const interactionChainPhaseResultSchema = z.union([
	z.object({
		coachMessage: z.string(),
		phaseComplete: z.literal(false)
	}),
	z.object({
		phaseComplete: z.literal(true),
		interactionChain: interactionChainSchema,
		coachMessage: z.string().optional()
	})
]);

export type InteractionChainPhaseResult = z.infer<typeof interactionChainPhaseResultSchema>;
