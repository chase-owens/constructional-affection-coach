import type { ConstructionalProgram } from "../../../../lambdas/src/domain";
import { getInterview, type PersistedInterview } from "./getInterview";

const wait = (durationMs: number) =>
	new Promise<void>((resolve) => {
		window.setTimeout(resolve, durationMs);
	});

type CompletedInterview = PersistedInterview & {
	status: "complete";
	program: ConstructionalProgram;
};

export const pollForCompletedInterview = async (
	interviewId: string
): Promise<CompletedInterview> => {
	const pollingIntervalMs = 2_000;
	const timeoutMs = 180_000;
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		const interview = await getInterview(interviewId);

		if (interview.status === "complete") {
			if (!interview.program) {
				throw new Error("Interview completed without a constructional program");
			}

			return {
				...interview,
				status: "complete",
				program: interview.program
			};
		}

		if (interview.status === "failed") {
			throw new Error(interview.errorCode ?? "The constructional program could not be generated.");
		}

		await wait(pollingIntervalMs);
	}

	throw new Error("Program generation did not complete before polling timed out.");
};
