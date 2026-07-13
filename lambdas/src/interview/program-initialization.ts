import OpenAI from "openai";
import { ProgramInitializationController } from "./controllers/program-initialization";
import {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../domain";

export const runProgramInitialization = async (
  openai: OpenAI,
  input: {
    targetOutcome: TargetOutcome;
    constructionalAssets: ConstructionalAssets;
    interactionChain: InteractionChain;
  },
) => {
  const controller = new ProgramInitializationController(openai);

  return controller.initialize(input);
};
