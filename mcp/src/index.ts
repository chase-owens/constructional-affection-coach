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

const server = new McpServer({
  name: "constructional-affection",
  version: "1.0.0",
});
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

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main();
