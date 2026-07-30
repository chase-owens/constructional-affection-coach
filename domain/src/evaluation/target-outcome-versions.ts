import { MODEL_IDS } from "./model-ids.js";
import type { PhaseVersionMetadata } from "./phase-version-metadata.js";

export const TARGET_OUTCOME_BASELINE = {
  phase: "target_outcome",
  implementationVersion: "1.0.0",
  schemaVersion: "1.0.0",
  experimentId: null,
  modelId: MODEL_IDS.GPT_4_1_MINI,
  orchestration: "custom",
  rubricVersion: "1.0.0",
} as const satisfies PhaseVersionMetadata;

export const TARGET_OUTCOME_V2_EXPERIMENT = {
  phase: "target_outcome",
  implementationVersion: "2.0.0-beta.1",
  schemaVersion: "2.0.0-beta.1",
  experimentId: "target-outcome-accomplishment-001",
  modelId: MODEL_IDS.GPT_5_MINI,
  orchestration: "custom",
  rubricVersion: "1.0.0",
} as const satisfies PhaseVersionMetadata;
