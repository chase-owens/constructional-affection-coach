import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ProgramInitialization } from "../../domain";
import jsonResponse from "../../util/jsonResponse";
import { logger } from "../../shared/logger";
import { error } from "console";

const dynamoClient = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(dynamoClient);

type CreateInterviewPayload = {
  interviewId: `${string}-${string}-${string}-${string}-${string}`;
  program: ProgramInitialization;
};

export const handler = async (event: any) => {
  const requestId = event.requestContext.requestId;
  const startedAt = Date.now();

  if (event.requestContext?.http?.method === "OPTIONS") {
    return jsonResponse(200, { ok: true });
  }

  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    return jsonResponse(500, {
      message: "Missing TABLE_NAME environment variable",
    });
  }

  try {
    const payload = JSON.parse(event.body || "{}") as CreateInterviewPayload;

    if (!payload.interviewId || !payload.program) {
      return jsonResponse(500, {
        message: "program and interviewId are required",
      });
    }

    const createdAt = new Date().toISOString();

    await documentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          interviewId: payload.interviewId.trim(),
          program: payload.program,
          createdAt,
        },
      }),
    );

    logger.info("interview.persistence.completed", {
      interviewId: payload.interviewId,
      requestId,
      druationMs: Date.now() - startedAt,
      stageCount: payload.program.programStages?.length ?? 0,
    });

    return jsonResponse(200, { success: true });
  } catch (err) {
    logger.error("interview.persistence.failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "UnknownError",
      errorMessage:
        error instanceof Error ? error.message : "Unknown persistence error",
    });

    return jsonResponse(500, { message: "Failed to save program" });
  }
};
