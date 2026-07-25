import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ClaimInterviewResponse = {
	interviewId: string;
	userId: string;
};

export const claimInterview = async (interviewId: string): Promise<ClaimInterviewResponse> => {
	const session = await fetchAuthSession();

	const token = session.tokens?.accessToken?.toString();

	if (!token) {
		throw new Error("You must be signed in to save this program.");
	}

	const response = await fetch(`${API_BASE_URL}/interviews/${interviewId}/claim`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const contentType = response.headers.get("content-type") ?? "";

	if (!contentType.includes("application/json")) {
		throw new Error("The interview service returned an unexpected response.");
	}

	const result = (await response.json()) as ClaimInterviewResponse | { message?: string };

	if (!response.ok) {
		throw new Error(
			"message" in result && result.message
				? result.message
				: `Unable to save program. Status ${response.status}.`
		);
	}

	return result as ClaimInterviewResponse;
};
