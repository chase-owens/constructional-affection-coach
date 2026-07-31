import { createConstructionalAffectionMcpHandler } from "@constructional-affection/mcp";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { getOpenAiClient } from "../interview/get-openai-client";

let mcpHandler: ReturnType<
  typeof createConstructionalAffectionMcpHandler
> | null = null;

const getMcpHandler = async (): Promise<
  ReturnType<typeof createConstructionalAffectionMcpHandler>
> => {
  if (mcpHandler) {
    return mcpHandler;
  }

  const openAi = await getOpenAiClient();

  mcpHandler = createConstructionalAffectionMcpHandler(openAi);

  return mcpHandler;
};

const toRequest = (event: APIGatewayProxyEventV2): Request => {
  const protocol = event.headers["x-forwarded-proto"] ?? "https";
  const host =
    event.headers["x-forwarded-host"] ?? event.headers.host ?? "localhost";

  const path = event.rawPath || "/mcp";

  const query = event.rawQueryString ? `?${event.rawQueryString}` : "";

  const url = `${protocol}://${host}${path}${query}`;
  const method = event.requestContext.http.method;

  const headers = new Headers();

  for (const [name, value] of Object.entries(event.headers)) {
    if (value !== undefined) {
      headers.set(name, value);
    }
  }

  const body =
    event.body === undefined
      ? undefined
      : event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body;

  return new Request(url, {
    method,
    headers,
    body: method === "GET" || method === "HEAD" ? undefined : body,
  });
};

const toApiGatewayResponse = async (
  response: Response,
): Promise<APIGatewayProxyResultV2> => {
  const headers: Record<string, string> = {};

  response.headers.forEach((value, name) => {
    headers[name] = value;
  });

  return {
    statusCode: response.status,
    headers,
    body: await response.text(),
    isBase64Encoded: false,
  };
};

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const mcpHandler = await getMcpHandler();
    const request = toRequest(event);
    const response = await mcpHandler.fetch(request);

    return await toApiGatewayResponse(response);
  } catch (error: unknown) {
    console.error("MCP request failed", error);

    return {
      statusCode: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
