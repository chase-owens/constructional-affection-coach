import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import jsonResponse from "../../util/jsonResponse";
import { logger } from "../../shared/logger";

const dynamoClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export type CreateInterviewPayload = {
  interviewId: `${string}-${string}-${string}-${string}-${string}`;
  userId: string | null;
};

export const handler = async (event: any) => {
  const requestId = event.requestContext.requestId;
  const startedAt = Date.now();

  // if (event.requestContext?.http?.method === "OPTIONS") {
  //   return jsonResponse(200, { ok: true });
  // }

  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    return jsonResponse(500, {
      message: "Missing TABLE_NAME environment variable",
    });
  }

  try {
    const payload = JSON.parse(event.body || "{}") as CreateInterviewPayload;

    const interviewId = payload.interviewId.trim();

    if (!interviewId) {
      return jsonResponse(400, { message: "interviewId is required" });
    }

    const now = new Date().toISOString();

    await documentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          interviewId: payload.interviewId.trim(),
          status: "pending",
          createdAt: now,
          updatedAt: now,
        },

        // this ensures we don't overwrite existing interviews
        ConditionExpression: "attribute_not_exists(interviewId)",
      }),
    );

    logger.info("interview.persistence.completed", {
      interviewId: payload.interviewId,
      requestId,
      druationMs: Date.now() - startedAt,
    });

    return jsonResponse(201, { interviewId, status: "pending" });
  } catch (err) {
    if (
      err instanceof Error &&
      err.name === "ConditionalCheckFailedException"
    ) {
      return jsonResponse(409, {
        message: "Interview already exists",
      });
    }

    logger.error("interview.creation.failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      errorName: err instanceof Error ? err.name : "UnknownError",
      errorMessage:
        err instanceof Error ? err.message : "Unknown persistence error",
    });

    return jsonResponse(500, {
      message: "Failed to create interview",
    });
  }
};
