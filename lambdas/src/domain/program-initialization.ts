import type { Approximation } from "./transfer-step";

export type ProgramInitialization = {
  initialApproximation: Approximation;
  readinessCriterion: string;
};
