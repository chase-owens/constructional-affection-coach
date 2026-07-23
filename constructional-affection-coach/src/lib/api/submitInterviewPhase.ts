import type { InterviewPhase } from "../../../../lambdas/src/domain";
import type {
	ConstructionalAssets,
	InteractionChain,
	TargetOutcome
} from "../../../../lambdas/src/schemas";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Message = {
	role: "coach" | "user";
	content: string;
};

export type SubmitInterviewPhaseRequest = {
	phase: InterviewPhase;
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

	const result = (await response.json()) as InterviewPhaseResponse;

	if (!response.ok) {
		throw new Error(
			result.error ?? `Interview phase request failed with status ${response.status}.`
		);
	}

	return result;
};
