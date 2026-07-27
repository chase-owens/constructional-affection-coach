import { z } from "zod";
import { targetOutcomeSchema } from "@constructional-affection/domain";

const NON_OBSERVABLE_TERMS = [
  "understand",
  "know",
  "learn",
  "develop",
  "feel",
  "like",
  "relax",
  "calm",
];

export const EVALUATE_TARGET_OUTCOME_TOOL_NAME = "evaluate_target_outcome";

export const evaluateTargetOutcomeInputSchema = z.object({
  targetOutcome: targetOutcomeSchema,
});

export type EvaluateTargetOutcomeInput = z.infer<
  typeof evaluateTargetOutcomeInputSchema
>;

export const evaluateTargetOutcome = ({
  targetOutcome,
}: EvaluateTargetOutcomeInput) => {
  const issues: string[] = [];

  if (targetOutcome.scope === "outside_constructional_affection") {
    return {
      valid: false,
      issues: [
        "The target outcome is outside the scope of Constructional Affection",
      ],
    };
  }

  // TODO: Evaluate needs_clarification once scope classification
  // is supported by gold examples and drift evaluation.

  if (!targetOutcome.isObservable) {
    issues.push("The target outcome is not directly observable");
  }

  if (!targetOutcome.isPositive) {
    issues.push("The target outcome is not positively stated");
  }

  if (!targetOutcome.primaryContext) {
    issues.push("The target outcome does not identify a context");
  }

  if (
    NON_OBSERVABLE_TERMS.some((term) =>
      targetOutcome.desiredInteractionPattern.toLowerCase().includes(term),
    )
  ) {
    issues.push(
      "The desired interaction pattern includes non-observable terms",
    );
  }

  return { issues, valid: issues.length === 0 };
};
