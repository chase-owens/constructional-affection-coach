import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../domain";
import { getOpenAiClient } from "./get-openai-client";
import { runProgramInitialization } from "./program-initialization";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

type StartProgramEvent = {
  interviewId: string;
  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  interactionChain: InteractionChain;
};

const getTableName = () => {
  const tableName = process.env.TABLE_NAME;

  if (!tableName) {
    throw new Error("TABLE_NAME is not configured");
  }

  return tableName;
};

const markProcessing = async (interviewId: string) => {
  const now = new Date().toISOString();

  await documentClient.send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { interviewId },

      UpdateExpression: `
        SET #status = :status,
            updatedAt = :updatedAt,
            processingStartedAt = :processingStartedAt
      `,
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":status": "processing",
        ":updatedAt": now,
        ":processingStartedAt": now,
      },
    }),
  );
};

const markComplete = async (interviewId: string, program: unknown) => {
  const now = new Date().toISOString();

  await documentClient.send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { interviewId },
      UpdateExpression: `
        SET #status = :status,
            program = :program,
            updatedAt = :updatedAt,
            completedAt = :completedAt
        REMOVE errorCode, failedAt
      `,

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":status": "complete",
        ":program": program,
        ":updatedAt": now,
        ":completedAt": now,
      },
    }),
  );
};

const markFailed = async (interviewId: string, error: unknown) => {
  const now = new Date().toISOString();

  await documentClient.send(
    new UpdateCommand({
      TableName: getTableName(),
      Key: { interviewId },

      UpdateExpression: `
        SET #status = :status,
            errorCode = :errorCode,
            updatedAt = :updatedAt,
            failedAt = :failedAt
      `,

      ExpressionAttributeNames: {
        "#status": "status",
      },

      ExpressionAttributeValues: {
        ":status": "failed",
        ":errorCode": "PROGRAM_GENERATION_FAILED",
        ":updatedAt": now,
        ":failedAt": now,
      },
    }),
  );

  console.error("program.worker.failed", {
    interviewId,
    errorName: error instanceof Error ? error.name : "UnknownError",
    errorMessage:
      error instanceof Error
        ? error.message
        : "Unknown program generation error",
  });
};

export const handler = async (event: StartProgramEvent): Promise<void> => {
  const { interviewId, targetOutcome, constructionalAssets, interactionChain } =
    event;

  if (!interviewId) {
    throw new Error("StartProgramEvent is missing interviewId.");
  }

  console.info("program.worker.started", {
    interviewId,
  });

  try {
    await markProcessing(interviewId);

    const openai = await getOpenAiClient();

    const result = await runProgramInitialization(openai, {
      targetOutcome,
      constructionalAssets,
      interactionChain,
    });

    if (!result.constructionalProgram) {
      throw new Error(
        "Program generation completed without a constructional program.",
      );
    }

    await markComplete(interviewId, result.constructionalProgram);

    console.info("program.persistence.completed", {
      interviewId,
    });
  } catch (err) {
    await markFailed(interviewId, err);

    throw err;
  }
};
