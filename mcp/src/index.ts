import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import {
  TARGET_OUTCOME_RESOURCE,
  TARGET_OUTCOME_RESOURCE_URI,
} from "./resources/target-outcome.js";

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

async function main() {
  const transport = new StdioServerTransport();

  await server.connect(transport);
}

main();
