export const TARGET_OUTCOME_QUESTION =
  "Assuming this process is successful, what would the outcome be?";

export type TargetOutcomeScope =
  | "within_constructional_affection"
  | "outside_constructional_affection"
  | "needs_clarification";

export type TargetConditions = {
  conditions: string[];

  disturbingPattern: string;

  targetPatternUnderThoseConditions: string;
};

export type TargetOutcome = {
  rawAnswer: string;
  clarifiedOutcome: string | null;
  desiredInteractionPattern: string | null;
  primaryContext: string | null;
  scope: TargetOutcomeScope;
  isPositive: boolean;
  isObservable: boolean;
  notes?: string;
};

export const DEFAULT_TARGET_OUTCOME: TargetOutcome = {
  rawAnswer: "",
  clarifiedOutcome: null,
  desiredInteractionPattern: null,
  primaryContext: null,
  scope: "needs_clarification",
  isPositive: false,
  isObservable: false,
};

export const TARGET_OUTCOME_EXIT_CRITERIA = {
  isPositive: true,
  isObservable: true,
  scope: "within_constructional_affection",
} as const;

export const TARGET_OUTCOME_EXAMPLES = [
  "Calmly waits for affection.",
  "Politely greets visitors.",
  "Lies quietly while I work.",
] as const;

export const TARGET_OUTCOME_OUT_OF_SCOPE_EXAMPLES = [
  "Guard the family.",
  "Potty train.",
  "Eliminate prey drive.",
  "Loose leash walking.",
  "Stop reacting to other dogs.",
] as const;
