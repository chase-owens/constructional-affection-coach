import type { InterviewPhase } from "../../../../../lambdas/src/domain";

export const phaseOrder: InterviewPhase[] = [
	"target_outcome",
	"interaction_chain",
	"constructional_assets",
	"program_initialization",
	"complete"
];

export const phaseTitle: Record<InterviewPhase, string> = {
	target_outcome: "What's the Goal?",
	interaction_chain: "Where Are We Now?",
	constructional_assets: "What Already Works?",
	program_initialization: "Where Do We Go From Here?",
	complete: "Complete"
};
