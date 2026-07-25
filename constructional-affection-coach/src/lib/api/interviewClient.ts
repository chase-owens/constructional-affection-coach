import { claimInterview } from "./claimInterview";
import { createInterviewRecord } from "./createInterview";
import { getInterview } from "./getInterview";
import { getInterviews } from "./getInterviews";
import { pollForCompletedInterview } from "./pollCompletedInterview";
import { submitInterviewPhase } from "./submitInterviewPhase";

export const interviewClient = {
	claim: claimInterview,
	create: createInterviewRecord,
	get: getInterview,
	getAll: getInterviews,
	pollComplete: pollForCompletedInterview,
	submitPhase: submitInterviewPhase
};
