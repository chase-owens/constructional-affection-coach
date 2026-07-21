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

  return controller.interview(messages);
};
