import type { InterviewPhase } from "@constructional-affection/domain";

import { phaseOrder } from "./constants";

export const getPhaseIndex = (phase: InterviewPhase) =>
	phaseOrder.findIndex((phaseItem) => phaseItem === phase);
