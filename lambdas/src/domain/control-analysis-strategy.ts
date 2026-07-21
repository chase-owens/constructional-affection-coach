export type StartingProcedure =
  | "interaction_guidelines"
  | "affection_loop"
  | "outside_scope"
  | "needs_more_information";

type TransferDimension = {
  name: string;
  initialValue: string;
  terminalValue: string;
  suggestedApproximations: string[];
};

export type ControlAnalysisStrategy = {
  startingProcedure: StartingProcedure;
  // initialConditions: ControllingCondition[];
  // terminalConditions: ControllingCondition[];
  strategySummary: string | null;
  rationale: string | null;
};

type ProgressionRules = {
  advanceWhen: string;
  ifControlWeakens: string;
  ifDisturbingPatternOccurs: string;
};

type ProgressionStrategy = {
  alterOneRelevantDimensionAtATime: true;
  advanceWhileControlIsMaintained: true;
  reduceChangeWhenControlWeakens: true;
  returnToPreviousSuccessfulConditionsWhenNeeded: true;
};

type ApproximationAttempt = {
  approximationId: string;
  outcome: "maintained_control" | "weakened_control" | "disturbing_pattern";
  observations: string;
};

type AdjustmentRecommendation =
  | { action: "advance" }
  | { action: "reduce_change"; recommendation: string }
  | { action: "return_to_previous"; approximationId: string }
  | { action: "collect_more_information"; question: string };

export const DEFAULT_CONTROL_ANALYSIS_STRATEGY: ControlAnalysisStrategy = {
  startingProcedure: "needs_more_information",
  // initialConditions: [],
  // terminalConditions: [],
  strategySummary: null,
  rationale: null,
};
