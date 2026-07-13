import type { ConstructionalAssets } from "./constructional-assets";
import type { InteractionChain } from "./interaction-chain";
import type { ControlAnalysisStrategy } from "./control-analysis-strategy";
import type { TargetOutcome } from "./target-outcome";

export type InterviewPhase =
  | "target_outcome"
  | "constructional_assets"
  | "interaction_chain"
  | "program_initialization"
  | "complete";

export type InterviewSession = {
  sessionId: string;
  phase: InterviewPhase;
  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  interactionChain: InteractionChain;
  controlAnalysisStrategy: ControlAnalysisStrategy;
};
