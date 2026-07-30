import type { ConstructionalProgram } from "@constructional-affection/domain";

import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { PUBLIC_USE_COMPLETED_MOCK } from "$env/static/public";
import { constructionalProgramMock } from "$lib/data/constructionalProgramMock";

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
	if (PUBLIC_USE_COMPLETED_MOCK === "true") {
		return { interviewId, program: constructionalProgramMock, status: "complete" };
	}

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
