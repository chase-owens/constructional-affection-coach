import type {
	ConstructionalAssets,
	InteractionChain,
	RunnableInterviewPhase,
	TargetOutcome,
	VersionedPhaseResult
} from "@constructional-affection/domain";

import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { InterviewResponse } from "$lib/interview/types";

const API_BASE_URL = PUBLIC_API_BASE_URL;

type Message = {
	role: "coach" | "user";
	content: string;
};

export type SubmitInterviewPhaseRequest = {
	phase: RunnableInterviewPhase | "program_initialization";
	messages?: Message[];
	targetOutcome?: TargetOutcome | null;
	constructionalAssets?: ConstructionalAssets | null;
	interactionChain?: InteractionChain | null;
};

export type InterviewPhaseResponse = {
	coachMessage?: string;
	phaseComplete: boolean;
	targetOutcome?: TargetOutcome;
	constructionalAssets?: ConstructionalAssets;
	interactionChain?: InteractionChain;
	outsideScope?: boolean;
	status?: "pending";
	error?: string;
};

export const submitInterviewPhase = async (
	interviewId: string,
	request: SubmitInterviewPhaseRequest
): Promise<InterviewPhaseResponse> => {
	const response = await fetch(`${API_BASE_URL}/interviews/${interviewId}/phase`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(request)
	});

	const contentType = response.headers.get("content-type") ?? "";

	if (!contentType.includes("application/json")) {
		throw new Error("The interview service returned an unexpected response.");
	}

	const phaseResponse = (await response.json()) as VersionedPhaseResult<InterviewResponse>;

	const result = phaseResponse.result;

	if (!response.ok) {
		throw new Error(
			result.error ?? `Interview phase request failed with status ${response.status}.`
		);
	}

	return result;
};
