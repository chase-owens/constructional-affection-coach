import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import jsonResponse from "../../util/jsonResponse";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;
const USER_INDEX = "userId-updatedAt-index";

export const handler = async (event: any) => {
  if (!TABLE_NAME) {
    return jsonResponse(500, {
      message: "TABLE_NAME environment variable not found",
    });
  }

  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;

  if (!userId) {
    return jsonResponse(401, {
      message: "Unauthorized",
    });
  }

  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: USER_INDEX,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        ScanIndexForward: false,
      }),
    );

    return jsonResponse(200, {
      interviews: result.Items ?? [],
    });
  } catch (err) {
    console.error("GET INTERVIEWS ERROR", err);

    return jsonResponse(500, {
      message: "Failed to fetch interviews",
    });
  }
};
