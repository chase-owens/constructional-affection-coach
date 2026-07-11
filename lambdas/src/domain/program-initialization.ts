export type ProgramStage = {
	index: number;
	title: string;
	targetPattern: string;
	interactionStepIndex?: number;
	entryCondition: string;
	successCriterion: string;
	reinforcers: string[];
	notes?: string;
};

export type ProgramInitialization = {
	startingPoint: string;
	terminalTargetPattern: string;
	programStages: ProgramStage[];
	rationale: string;
	notes?: string;
};
