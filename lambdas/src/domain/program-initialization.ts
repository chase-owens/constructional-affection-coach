import type { Approximation, LegacyApproximation } from "./transfer-step";

export type ProgramStage = {
  index: number;
  title: string;
  targetPattern: string;
  interactionStepIndex?: number;
  entryCondition: string;
  successCriterion: string;
  reinforcers: string[];
  approximations: LegacyApproximation[];
  notes?: string;
};

export type LegacyProgramInitialization = {
  startingPoint: string;
  terminalTargetPattern: string;
  programStages: ProgramStage[];
  rationale: string;
  notes?: string;
};

export type ProgramInitialization = {
  initialApproximation: Approximation;
  readinessCriterion: string;
};
