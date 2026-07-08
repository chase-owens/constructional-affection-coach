export const INITIAL_INTERACTION_QUESTION =
	'How does what we want to happen differ from what is currently happening? What does the chain look like today?';

export type InteractionStepActor = 'person' | 'dog' | 'environment';

export type InteractionStepRole =
	'current_control' | 'transfer_step' | 'terminal_condition' | 'unclear';

export type InteractionStep = {
	index: number;
	actor: InteractionStepActor;

	// A tiny observable slice.
	description: string;

	// What changes from the previous step?
	change: string;
	// What should the dog be doing at this slice?
	expectedDogBehavior?: string;

	// Is the target pattern still under control here?
	targetPatternPresent: boolean | 'unknown';

	// Does this step need to be trained/transferred later?
	requiresTransfer: boolean;

	notes?: string;
};

export type InteractionChain = {
	steps: InteractionStep[];
	constructionStartIndex: number;
	targetOutcomeIndex: number;
	notes: string;
};
