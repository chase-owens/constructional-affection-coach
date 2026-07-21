import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { error } from "@sveltejs/kit";

type CreateInterviewPayload = {
	interviewId: `${string}-${string}-${string}-${string}-${string}`;
};

export const createInterviewRecord = async (interview: CreateInterviewPayload) => {
	const response = await fetch(`${PUBLIC_API_BASE_URL}/interviews`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(interview)
	});

	if (!response.ok) {
		error(500, "create interview error");
	}

	return response.json();
};
