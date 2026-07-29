import type { ConstructionalAssets } from "../schemas/constructional-assets.js";
import type { InteractionChain } from "../schemas/interaction-chain.js";
import type { TargetOutcome } from "../schemas/target-outcome.js";

export type InterviewPhase =
  | "target_outcome"
  | "interaction_chain"
  | "constructional_assets"
  | "program_initialization"
  | "revise_target_outcome"
  | "complete";

export const RUNNABLE_INTERVIEW_PHASES = [
  "target_outcome",
  "interaction_chain",
  "constructional_assets",
  "program_initialization",
] as const satisfies readonly InterviewPhase[];

export type RunnableInterviewPhase = (typeof RUNNABLE_INTERVIEW_PHASES)[number];

export const isRunnableInterviewPhase = (
  phase: InterviewPhase,
): phase is RunnableInterviewPhase =>
  RUNNABLE_INTERVIEW_PHASES.some((runnablePhase) => runnablePhase === phase);

export type InterviewMessage = {
  role: "coach" | "user";
  content: string;
};

export type InterviewRequest = {
  interviewId: `${string}-${string}-${string}-${string}-${string}`;
  phase: InterviewPhase;
  messages: InterviewMessage[];
  targetOutcome?: TargetOutcome | null;
  constructionalAssets?: ConstructionalAssets | null;
  interactionChain?: InteractionChain | null;
};

export type RunnableInterviewRequest = InterviewRequest & {
  phase: RunnableInterviewPhase;
};
