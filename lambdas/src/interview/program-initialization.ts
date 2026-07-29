import OpenAI from "openai";
import { ProgramInitializationController } from "./controllers/program-initialization/program-initialization-controller";
import type { InteractionChain } from "../schemas";
import type { ValidationIssue } from "../validation/types";
import type {
  ConstructionalAssets,
  TargetOutcome,
} from "@constructional-affection/domain";
import { ModelId } from "../../../domain/src/evaluation/model-ids";

export const runProgramInitialization = async (
  openai: OpenAI,
  input: {
    modelId: ModelId;
    targetOutcome: TargetOutcome;
    constructionalAssets: ConstructionalAssets;
    interactionChain: InteractionChain;
    validationIssues?: ValidationIssue[];
  },
) => {
  console.log("calling controller");
  const controller = new ProgramInitializationController(openai);

  return controller.initialize(input);
};
