import { z } from "zod";

export const reinforcerStatusSchema = z.enum([
  "clearly_reinforcing",
  "sometimes_reinforcing",
  "unclear",
  "not_reinforcing",
  "over_arousing",
]);

export const socialReinforcersSchema = z.object({
  touch: reinforcerStatusSchema,
  talk: reinforcerStatusSchema,
  eyeContact: reinforcerStatusSchema,
  proximity: reinforcerStatusSchema,
});

export const relevantSkillSchema = z.object({
  name: z.string(),
  context: z.string().optional(),
  notes: z.string().optional(),
});

export const relevantConditionSchema = z.object({
  description: z.string(),
  behaviorObserved: z.string(),
  notes: z.string().optional(),
});

export const constructionalAssetsSchema = z.object({
  socialReinforcers: socialReinforcersSchema,
  relevantSkills: z.array(relevantSkillSchema),
  conditionsWhereTargetPatternOccurs: z.array(relevantConditionSchema),
  notes: z.string().optional(),
});

export const constructionalAssetsPhaseResultSchema = z.union([
  z.object({
    coachMessage: z.string(),
    phaseComplete: z.literal(false),
  }),
  z.object({
    phaseComplete: z.literal(true),
    constructionalAssets: constructionalAssetsSchema,
    coachMessage: z.string().optional(),
  }),
]);

export type ReinforcerStatus = z.infer<typeof reinforcerStatusSchema>;

export type SocialReinforcers = z.infer<typeof socialReinforcersSchema>;

export type RelevantSkill = z.infer<typeof relevantSkillSchema>;

export type RelevantCondition = z.infer<typeof relevantConditionSchema>;

export type ConstructionalAssets = z.infer<typeof constructionalAssetsSchema>;

export type ConstructionalAssetsPhaseResult = z.infer<
  typeof constructionalAssetsPhaseResultSchema
>;

export const DEFAULT_CONSTRUCTIONAL_ASSETS: ConstructionalAssets = {
  socialReinforcers: {
    touch: "unclear",
    talk: "unclear",
    eyeContact: "unclear",
    proximity: "unclear",
  },
  relevantSkills: [],
  conditionsWhereTargetPatternOccurs: [],
};
