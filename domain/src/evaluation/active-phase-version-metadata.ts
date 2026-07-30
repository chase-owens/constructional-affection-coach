import type { RunnableInterviewPhase } from "../types/phase.js";
import { CONSTRUCTIONAL_ASSETS_BASELINE } from "./assets-versions.js";
import { INTERACTION_CHAIN_BASELINE } from "./interaction-chain-versions.js";
import type { PhaseVersionMetadata } from "./phase-version-metadata.js";
import { PROGRAM_INITIALIZATION_BASELINE } from "./program-initialization-versions.js";
import { TARGET_OUTCOME_BASELINE } from "./target-outcome-versions.js";

export const ACTIVE_PHASE_VERSION_METADATA = {
  target_outcome: TARGET_OUTCOME_BASELINE,
  constructional_assets: CONSTRUCTIONAL_ASSETS_BASELINE,
  interaction_chain: INTERACTION_CHAIN_BASELINE,
  program_initialization: PROGRAM_INITIALIZATION_BASELINE,
} as const satisfies Record<RunnableInterviewPhase, PhaseVersionMetadata>;
