import type { InterviewPhase } from "../types/phase.js";
import type { ModelId } from "./model-ids.js";

export type PhaseVersionMetadata = {
  phase: InterviewPhase;

  // Prompt, instructions, decision - heuristic rules, and processing logic
  implementationVersion: string;

  // Phase shape exhanged with UI
  schemaVersion: string;

  experimentId: string | null;

  // Acutal OpenAI model used
  modelId: ModelId;

  orchestration: "custom" | "mcp";
};

export type VersionedPhaseResult<T> = {
  metadata: PhaseVersionMetadata;
  result: T;
};
