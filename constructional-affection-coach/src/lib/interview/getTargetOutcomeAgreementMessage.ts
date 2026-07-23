import type { TargetOutcome } from "../../../../lambdas/src/schemas";

export const getTargetOutcomeAgreementMessage = (targetOutcome: TargetOutcome) => ({
	role: "coach" as const,
	content: `Before I build your starting program, I want to make sure this is the interaction you want to work toward:

      Context: ${targetOutcome.primaryContext}

      Goal: ${targetOutcome.desiredInteractionPattern}

      Does that look right?`
});
