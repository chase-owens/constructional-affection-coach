import OpenAI from "openai";
import { ProgramInitializationController } from "./controllers/program-initialization/program-initialization-controller";
import {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../domain";
import type { ZodError } from "zod";

export type ValidationIssue = ZodError["issues"][number];

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
