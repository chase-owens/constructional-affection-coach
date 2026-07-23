import { browser } from "$app/environment";
import { writable } from "svelte/store";

const STORAGE_KEY = "constructional-affection-program";

type InterviewProgram = {
	interviewId: `${string}-${string}-${string}-${string}-${string}`;
	updatedAt: string;
};

export const savedProgram = writable<InterviewProgram | null>(
	browser ? JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") : null
);

savedProgram.subscribe((value) => {
	if (!browser) return;

	if (value) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	} else {
		localStorage.removeItem(STORAGE_KEY);
	}
});
