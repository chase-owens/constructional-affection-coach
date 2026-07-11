import OpenAI from "openai";

import {
  ConstructionalAssetsController,
  type InterviewMessage,
} from "./controllers/constructional-assets";

export const runConstructionalAssetsInterview = async (
  openai: OpenAI,
  messages: InterviewMessage[],
) => {
  const controller = new ConstructionalAssetsController(openai);

  return controller.interview(messages);
};
