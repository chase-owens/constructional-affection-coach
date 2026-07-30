import type { ConstructionalProgram } from "@constructional-affection/domain";
import { fetchAuthSession } from "aws-amplify/auth";

import { PUBLIC_API_BASE_URL } from "$env/static/public";

export type SavedProgram = {
	interviewId: string;
	program: ConstructionalProgram;
	createdAt: string;
	updatedAt: string;
	completedAt: string;
};

type GetInterviewResponse = {
	interviews: SavedProgram[];
};

export const getInterviews = async (): Promise<SavedProgram[]> => {
	const session = await fetchAuthSession();
	const token = session.tokens?.accessToken?.toString();
	const response = await fetch(`${PUBLIC_API_BASE_URL}/interviews`, {
		headers: { Authorization: `Bearer ${token}` }
	});

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

	if (!result.interviews) {
		throw new Error("Interview response did not include an interview.");
	}

	return result.interviews;
};
