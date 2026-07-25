import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import jsonResponse from "../../util/jsonResponse";

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: any) => {
  if (!TABLE_NAME) {
    return jsonResponse(500, {
      message: "TABLE_NAME environment variable not found",
    });
  }

  const interviewId = event.pathParameters?.interviewId;

  const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;

  if (!interviewId) {
    return jsonResponse(400, {
      message: "interviewId is required",
    });
  }

  if (!userId) {
    return jsonResponse(401, {
      message: "Unauthorized",
    });
  }

  try {
    const now = new Date().toISOString();

    await documentClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          interviewId,
        },

        UpdateExpression: `
          SET userId = :userId,
              updatedAt = :updatedAt
        `,

        ConditionExpression: `
          attribute_exists(interviewId)
          AND (
            attribute_not_exists(userId)
            OR userId = :userId
          )
        `,

        ExpressionAttributeValues: {
          ":userId": userId,
          ":updatedAt": now,
        },
      }),
    );

    return jsonResponse(200, {
      interviewId,
      userId,
    });
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === "ConditionalCheckFailedException"
    ) {
      return jsonResponse(409, {
        message: "Interview cannot be claimed",
      });
    }

    console.error("CLAIM INTERVIEW ERROR", err);

    return jsonResponse(500, {
      message: "Failed to claim interview",
    });
  }
};
