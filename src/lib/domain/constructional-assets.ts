export type ReinforcerStatus =
	'clearly_reinforcing' | 'sometimes_reinforcing' | 'unclear' | 'not_reinforcing' | 'over_arousing';

export type SocialReinforcers = {
	touch: ReinforcerStatus;
	talk: ReinforcerStatus;
	eyeContact: ReinforcerStatus;
	proximity: ReinforcerStatus;
};

export type RelevantSkill = {
	name: string;
	context?: string;
	notes?: string;
};

export type RelevantCondition = {
	description: string;
	behaviorObserved: string;
	notes?: string;
};

export type ConstructionalAssets = {
	socialReinforcers: SocialReinforcers;
	relevantSkills: RelevantSkill[];
	conditionsWhereTargetPatternOccurs: RelevantCondition[];
	notes?: string;
};

export const DEFAULT_CONSTRUCTIONAL_ASSETS: ConstructionalAssets = {
	socialReinforcers: {
		touch: 'unclear',
		talk: 'unclear',
		eyeContact: 'unclear',
		proximity: 'unclear'
	},
	relevantSkills: [],
	conditionsWhereTargetPatternOccurs: []
};
