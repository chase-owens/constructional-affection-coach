import OpenAI from "openai";
import { ProgramInitializationController } from "./controllers/program-initialization/program-initialization-controller";
import {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../schemas";
import type { ValidationIssue } from "../validation/types";

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
