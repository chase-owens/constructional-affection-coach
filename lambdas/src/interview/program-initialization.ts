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
  const result = await controller.initialize(input);

  return controller.initialize({
    targetOutcome: input.targetOutcome,
    constructionalAssets: input.constructionalAssets,
    interactionChain: input.interactionChain,
  });
};
