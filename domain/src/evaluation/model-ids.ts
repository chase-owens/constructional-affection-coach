export const MODEL_IDS = {
  GPT_4_1_MINI: "chat-4.1-mini",
  GPT_5_MINI: "chat-5-mini",
};

export type ModelId = (typeof MODEL_IDS)[keyof typeof MODEL_IDS];
