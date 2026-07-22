import type { InterviewPhase } from "../../../../lambdas/src/domain";
import { phaseOrder } from "./constants";

export const getPhaseIndex = (phase: InterviewPhase) =>
	phaseOrder.findIndex((phaseItem) => phaseItem === phase);
