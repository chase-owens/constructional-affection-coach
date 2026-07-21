import OpenAI from "openai";
import {
  InteractionChainController,
  type InterviewMessage,
} from "./controllers/interaction-chain";

export const runInteractionChainInterview = async (
  openai: OpenAI,
  messages: InterviewMessage[],
) => {
  const controller = new InteractionChainController(openai);

  return controller.interview(messages);
};
