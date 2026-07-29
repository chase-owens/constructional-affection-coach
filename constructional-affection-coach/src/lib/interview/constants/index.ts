import type { InterviewPhase } from "@constructional-affection/domain";

export const phaseOrder: InterviewPhase[] = [
	"target_outcome",
	"interaction_chain",
	"constructional_assets",
	"program_initialization",
	"revise_target_outcome",
	"complete"
];

export const phaseTitle: Record<InterviewPhase, string> = {
	target_outcome: "What's the Goal?",
	interaction_chain: "Where Are We Now?",
	constructional_assets: "What Already Works?",
	program_initialization: "Where Do We Go From Here?",
	revise_target_outcome: "What's The Goal",
	complete: "Complete"
};
