import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import {
  TARGET_OUTCOME_RESOURCE,
  TARGET_OUTCOME_RESOURCE_URI,
} from "./resources/target-outcome.js";
import {
  EVALUATE_TARGET_OUTCOME_TOOL_NAME,
  evaluateTargetOutcome,
  evaluateTargetOutcomeInputSchema,
} from "./tools/evaluate-target-outcome.js";
import {
  CONSTRUCTIONAL_ASSETS_RESOURCE,
  CONSTRUCTIONAL_ASSETS_RESOURCE_URI,
} from "./resources/constructional-assets.js";
import {
  EVALUATE_CONSTRUCTIONAL_ASSETS_TOOL_NAME,
  evaluateConstructionalAssets,
  evaluateConstructionalAssetsInputSchema,
} from "./tools/evaluate-constructional-assets.js";
import "dotenv/config";
import OpenAI from "openai";

const server = new McpServer({
  name: "constructional-affection",
  version: "1.0.0",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Register resources
server.registerResource(
  "target-outcome",
  TARGET_OUTCOME_RESOURCE_URI,
  {
    title: "Constructional Affection Target Outcome",
    description:
      "Methodology for defining a Constructional Affection Target Outcome",
    mimeType: "text/markdown",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: TARGET_OUTCOME_RESOURCE,
      },
    ],
  }),
);

server.registerResource(
  "constructional-assets",
  CONSTRUCTIONAL_ASSETS_RESOURCE_URI,
  {
    title: "Constructional Affection Constructional Assets",
    description:
      "Methodology for identifying Constructional Affection Constructional Assets",
    mimeType: "text/markdown",
  },
  async (uri) => ({
    contents: [{ uri: uri.href, text: CONSTRUCTIONAL_ASSETS_RESOURCE }],
  }),
);

server.registerTool(
  EVALUATE_TARGET_OUTCOME_TOOL_NAME,
  {
    title: "Evaluate Target Outcome",
    description:
      "Evaluates a Target Outcome against Constructional Affection methodology.",
    inputSchema: evaluateTargetOutcomeInputSchema,
  },
  async (input) => {
    const result = evaluateTargetOutcome(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  },
);

server.registerTool(
  EVALUATE_CONSTRUCTIONAL_ASSETS_TOOL_NAME,
  {
    title: "Evaluate Constructional Assets",
    description:
      "Evaluates Constructional Assets against Constructional Affection methodology",
    inputSchema: evaluateConstructionalAssetsInputSchema,
  },
  async (input) => {
    const result = await evaluateConstructionalAssets({ openai, input });

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main();
