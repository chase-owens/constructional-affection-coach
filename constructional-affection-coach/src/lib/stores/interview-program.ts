import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type {
	ConstructionalAssets,
	InteractionChain,
	ProgramInitialization,
	TargetOutcome
} from '../../../../lambdas/src/domain';

const STORAGE_KEY = 'constructional-affection-program';

type InterviewProgram = {
	interviewId: `${string}-${string}-${string}-${string}-${string}`;
	targetOutcome: TargetOutcome | null;
	constructionalAssets: ConstructionalAssets | null;
	interactionChain: InteractionChain | null;
	programInitialization: ProgramInitialization | null;
};

export const savedProgram = writable<InterviewProgram | null>(
	browser ? JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') : null
);

savedProgram.subscribe((value) => {
	if (!browser) return;

	if (value) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	} else {
		localStorage.removeItem(STORAGE_KEY);
	}
});
