import type { TargetOutcome } from "./target-outcome";
import type { ConstructionalAssets } from "./constructional-assets";
import type { ProgramInitialization } from "./program-initialization";
import type { ControlAnalysis } from "./control-analysis";
import type { ProgramPhase } from "./transfer-step";

export type ConstructionalProgram = {
  schemaVersion: "1.0";

  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  controlAnalysis: ControlAnalysis;
  initialization: ProgramInitialization;

  transferPlan: {
    phases: ProgramPhase[];
    terminalCriterion: string;
  };
};
