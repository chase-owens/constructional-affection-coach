import { z } from 'zod';

const reinforcerStatusSchema = z.enum([
	'clearly_reinforcing',
	'sometimes_reinforcing',
	'unclear',
	'not_reinforcing',
	'over_arousing'
]);

const constructionalAssetsSchema = z.object({
	socialReinforcers: z.object({
		touch: reinforcerStatusSchema,
		talk: reinforcerStatusSchema,
		eyeContact: reinforcerStatusSchema,
		proximity: reinforcerStatusSchema
	}),
	relevantSkills: z.array(
		z.object({
			name: z.string(),
			context: z.string().optional(),
			notes: z.string().optional()
		})
	),
	conditionsWhereTargetPatternOccurs: z.array(
		z.object({
			description: z.string(),
			behaviorObserved: z.string(),
			notes: z.string().optional()
		})
	),
	notes: z.string().optional()
});

export const constructionalAssetsPhaseResultSchema = z.union([
	z.object({
		coachMessage: z.string(),
		phaseComplete: z.literal(false)
	}),
	z.object({
		phaseComplete: z.literal(true),
		constructionalAssets: constructionalAssetsSchema,
		coachMessage: z.string().optional()
	})
]);

export type ConstructionalAssetsPhaseResult = z.infer<typeof constructionalAssetsPhaseResultSchema>;
