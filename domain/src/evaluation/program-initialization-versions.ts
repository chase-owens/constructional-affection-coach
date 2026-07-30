import { MODEL_IDS } from "./model-ids.js";
import type { PhaseVersionMetadata } from "./phase-version-metadata.js";

export const PROGRAM_INITIALIZATION_BASELINE = {
  phase: "program_initialization",
  implementationVersion: "1.0.0",
  schemaVersion: "1.0.0",
  experimentId: null,
  modelId: MODEL_IDS.GPT_4_1_MINI,
  orchestration: "custom",
} as const satisfies PhaseVersionMetadata;
