import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

type InterviewStatus = "pending" | "processing" | "complete" | "failed";

export type PersistedInterview = {
	interviewId: string;
	status: InterviewStatus;
	program?: ConstructionalProgram;
	errorCode?: string;
	createdAt?: string;
	updatedAt?: string;
	processingStartedAt?: string;
	completedAt?: string;
	failedAt?: string;
};

type GetInterviewResponse = {
	interview: PersistedInterview;
};

export const getInterview = async (interviewId: string): Promise<PersistedInterview> => {
	const response = await fetch(`${PUBLIC_API_BASE_URL}/interviews/${interviewId}`);

	const contentType = response.headers.get("content-type") ?? "";

	if (!contentType.includes("application/json")) {
		const responseText = await response.text();

		console.error("Expected JSON from interview status endpoint", {
			status: response.status,
			contentType,
			responseText: responseText.slice(0, 500)
		});

		throw new Error("The interview status service returned an unexpected response.");
	}

	const result = (await response.json()) as GetInterviewResponse;

	if (!response.ok) {
		throw new Error(`Failed to retrieve interview: ${response.status}`);
	}

	if (!result.interview) {
		throw new Error("Interview response did not include an interview.");
	}

	return result.interview;
};
