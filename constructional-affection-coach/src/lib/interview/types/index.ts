import type {
	ConstructionalAssets,
	ConstructionalProgram,
	InteractionChain
} from "../../../../../lambdas/src/schemas";
import type { TargetOutcome } from "@constructional-affection/domain";

export type InterviewIdType = `${string}-${string}-${string}-${string}-${string}`;

export type InterviewResponse = {
	coachMessage?: string;
	phaseComplete: boolean;
	targetOutcome?: TargetOutcome;
	constructionalAssets?: ConstructionalAssets;
	interactionChain?: InteractionChain;

	constructionalProgram?: ConstructionalProgram;

	outsideScope?: boolean;
	error?: string;
};

export type Message = {
	role: "coach" | "user";
	content: string;
};
