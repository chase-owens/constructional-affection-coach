import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import jsonResponse from "../../util/jsonResponse";
import { APIGatewayProxyEventV2 } from "aws-lambda";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: APIGatewayProxyEventV2) => {
  if (!TABLE_NAME) {
    return jsonResponse(500, {
      message: "TABLE_NAME environment variable not found",
    });
  }

  const interviewId = event.pathParameters?.interviewId;

  if (!interviewId) {
    return jsonResponse(400, { message: "interviewId is requried" });
  }

  try {
    const result = await docClient.send(
      new GetCommand({ TableName: TABLE_NAME, Key: { interviewId } }),
    );

    if (!result.Item) {
      return jsonResponse(404, { message: "Interview not found" });
    }

    return jsonResponse(200, { interview: result.Item });
  } catch (err) {
    console.error("GET INTERVIEW ERROR", {
      interviewId,
      error: err instanceof Error ? err.message : "Unknown error",
    });

    return jsonResponse(500, { message: "Failed to fech interview" });
  }
};
