import OpenAI from "openai";
import { ProgramInitializationController } from "./controllers/program-initialization/program-initialization-controller";
import type { ConstructionalAssets, InteractionChain } from "../schemas";
import type { ValidationIssue } from "../validation/types";
import type { TargetOutcome } from "@constructional-affection/domain";

export const runProgramInitialization = async (
  openai: OpenAI,
  input: {
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
