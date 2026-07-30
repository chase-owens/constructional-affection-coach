import { MODEL_IDS } from "./model-ids.js";
import type { PhaseVersionMetadata } from "./phase-version-metadata.js";

export const CONSTRUCTIONAL_ASSETS_BASELINE = {
  phase: "constructional_assets",
  implementationVersion: "1.0.0",
  schemaVersion: "1.0.0",
  experimentId: null,
  modelId: MODEL_IDS.GPT_4_1_MINI,
  orchestration: "custom",
  rubricVersion: "1.0.0",
} as const satisfies PhaseVersionMetadata;
