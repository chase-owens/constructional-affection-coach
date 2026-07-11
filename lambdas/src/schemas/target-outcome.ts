import { z } from 'zod';

const targetOutcomeSchema = z.object({
	rawAnswer: z.string(),
	clarifiedOutcome: z.string(),
	desiredInteractionPattern: z.string(),
	primaryContext: z.string().nullable(),
	scope: z.enum([
		'within_constructional_affection',
		'outside_constructional_affection',
		'needs_clarification'
	]),
	isPositive: z.boolean(),
	isObservable: z.boolean(),
	notes: z.string().optional()
});

export const targetOutcomePhaseResultSchema = z.union([
	z.object({
		coachMessage: z.string(),
		phaseComplete: z.literal(false)
	}),
	z.object({
		coachMessage: z.string(),
		phaseComplete: z.literal(true),
		targetOutcome: targetOutcomeSchema
	}),
	z.object({
		coachMessage: z.string(),
		phaseComplete: z.literal(true),
		outsideScope: z.literal(true),
		reason: z.string()
	})
]);

export type TargetOutcomePhaseResult = z.infer<typeof targetOutcomePhaseResultSchema>;
