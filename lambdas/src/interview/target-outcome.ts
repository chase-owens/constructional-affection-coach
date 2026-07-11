import OpenAI from "openai";
import {
  TargetOutcomeController,
  type InterviewMessage,
} from "./controllers/target-outcome";

export const runTargetOutcomeInterview = async (
  openai: OpenAI,
  messages: InterviewMessage[],
) => {
  const controller = new TargetOutcomeController(openai);
  const result = await controller.interview(messages);

  return controller.interview(messages);
};
