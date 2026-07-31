import { McpServer } from "@modelcontextprotocol/server";
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
import OpenAI from "openai";
import {
  INTERACTION_CHAIN_RESOURCE,
  INTERACTION_CHAIN_RESOURCE_URI,
} from "./resources/interaction-chain.js";
import {
  INITIALIZE_CONSTRUCTIONAL_AFFECTION_PROGRAM_RESOURCE,
  INITIALIZE_CONSTRUCTIONAL_AFFECTION_PROGRAM_RESOURCE_URI,
} from "./resources/program-initialization.js";

export const createServer = (openai: OpenAI): McpServer => {
  const server = new McpServer({
    name: "constructional-affection",
    version: "1.0.0",
  });

  // Register Resources
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
      contents: [{ uri: uri.href, text: TARGET_OUTCOME_RESOURCE }],
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

  server.registerResource(
    "interaction-chain",
    INTERACTION_CHAIN_RESOURCE_URI,
    {
      title: "Constructional Affection Interaction Chain",
      description:
        "Methodology for identifying the Interaction Chain for the Target Outcome",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{ uri: uri.href, text: INTERACTION_CHAIN_RESOURCE }],
    }),
  );

  server.registerResource(
    "program-initialization",
    INITIALIZE_CONSTRUCTIONAL_AFFECTION_PROGRAM_RESOURCE_URI,
    {
      title: "Constructional Affection Program Initialization",
      description:
        "Methodology for creating a Constructional Affection Program",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: INITIALIZE_CONSTRUCTIONAL_AFFECTION_PROGRAM_RESOURCE,
        },
      ],
    }),
  );

  // Register Tools
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

  return server;
};
