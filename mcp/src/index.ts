import { createMcpHandler } from "@modelcontextprotocol/server";
import { OpenAI } from "openai";

import { createServer } from "./server.js";

export { createServer } from "./server.js";

export const createConstructionalAffectionMcpHandler = (openai: OpenAI) =>
  createMcpHandler(() => createServer(openai));
