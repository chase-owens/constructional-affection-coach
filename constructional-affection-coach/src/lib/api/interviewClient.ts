import { createInterviewRecord } from "./createInterview";
import { getInterview } from "./getInterview";
import { pollForCompletedInterview } from "./pollCompletedInterview";
import { submitInterviewPhase } from "./submitInterviewPhase";

export const interviewClient = {
	create: createInterviewRecord,
	get: getInterview,
	pollComplete: pollForCompletedInterview,
	submitPhase: submitInterviewPhase
};
