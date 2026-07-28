import type { TargetOutcome } from "@constructional-affection/domain";

export const startConstructionalAssetsPhase = (targetOutcome: TargetOutcome) =>
	`You said you'd like to see ${targetOutcome.targetActions.join(" or ")}.
Does your dog already do any part of that, even in a different situation?`;
