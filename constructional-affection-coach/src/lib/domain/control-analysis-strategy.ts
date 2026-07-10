// import type { ControllingCondition } from './control-analysis';

export type StartingProcedure =
	'interaction_guidelines' | 'affection_loop' | 'outside_scope' | 'needs_more_information';

export type ControlAnalysisStrategy = {
	startingProcedure: StartingProcedure;
	// initialConditions: ControllingCondition[];
	// terminalConditions: ControllingCondition[];
	strategySummary: string | null;
	rationale: string | null;
};

export const DEFAULT_CONTROL_ANALYSIS_STRATEGY: ControlAnalysisStrategy = {
	startingProcedure: 'needs_more_information',
	// initialConditions: [],
	// terminalConditions: [],
	strategySummary: null,
	rationale: null
};
