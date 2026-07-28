import { z } from "zod";

export const reinforcerStatusSchema = z.enum([
  "clearly_reinforcing",
  "sometimes_reinforcing",
  "unclear",
  "not_reinforcing",
  "over_arousing",
]);

export const socialReinforcersSchema = z.object({
  approachesVoluntarily: z.enum(["yes", "no"]),
  evidence: z.array(z.string().trim()),
  reinforcers: z.object({
    touch: reinforcerStatusSchema,
    talk: reinforcerStatusSchema,
    eyeContact: reinforcerStatusSchema,
    proximity: reinforcerStatusSchema,
  }),
});

export const relevantSkillSchema = z.object({
  name: z.string().trim().min(1),
  context: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
});

export const relevantConditionSchema = z.object({
  description: z.string().trim().min(1),
  behaviorObserved: z.string().trim().min(1),
  notes: z.string().trim().min(1).optional(),
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
    approachesVoluntarily: "yes",
    evidence: [],
    reinforcers: {
      touch: "unclear",
      talk: "unclear",
      eyeContact: "unclear",
      proximity: "unclear",
    },
  },
  relevantSkills: [],
  conditionsWhereTargetPatternOccurs: [],
};
