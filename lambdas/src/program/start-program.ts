import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type {
  ConstructionalAssets,
  InteractionChain,
  TargetOutcome,
} from "../domain";
import { getOpenAiClient } from "../interview/get-openai-client";
import {
  runProgramInitialization,
  ValidationIssue,
} from "../interview/program-initialization";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { constructionalProgramSchema } from "../schemas/constructional-program";
import {
  ProgramGenerationError,
  ProgramValidationError,
} from "../program/errors";
import type { ZodError } from "zod";

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});

type StartProgramEvent = {
  interviewId: string;
  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  interactionChain: InteractionChain;
};

type ProgramWorkerError = Error & {
  code?: string;
};

const MAX_GENERATION_ATTEMPTS = 2;

const getErrorCode = (error: unknown) => {
  if (
    error instanceof Error &&
    "code" in error &&
    typeof (error as ProgramWorkerError).code === "string"
  ) {
    return (error as ProgramWorkerError).code!;
  }

  return "PROGRAM_GENERATION_FAILED";
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
  const errorCode = getErrorCode(error);

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
        ":errorCode": errorCode,
        ":updatedAt": now,
        ":failedAt": now,
      },
    }),
  );

  console.error("program.worker.failed", {
    interviewId,
    errorCode,
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

    let validationIssues: ValidationIssue[] | undefined;
    let lastValidationError: ZodError | undefined;

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const result = await runProgramInitialization(openai, {
        targetOutcome,
        constructionalAssets,
        interactionChain,
        validationIssues,
      });

      if (!result.constructionalProgram) {
        throw new ProgramGenerationError(
          "Program generation completed without a constructional program.",
        );
      }

      const parsedProgram = constructionalProgramSchema.safeParse(
        result.constructionalProgram,
      );

      if (parsedProgram.success) {
        await markComplete(interviewId, parsedProgram.data);

        console.info("program.persistence.completed", {
          interviewId,
          attempt,
        });

        return;
      }

      lastValidationError = parsedProgram.error;
      validationIssues = parsedProgram.error.issues;

      console.warn("program.validation.failed", {
        interviewId,
        attempt,
        issues: validationIssues.map((issue) => ({
          path: issue.path.map(String).join("."),
          code: issue.code,
          message: issue.message,
        })),
      });

      continue;
    }

    if (lastValidationError) {
      throw new ProgramValidationError(lastValidationError);
    }

    throw new ProgramGenerationError(
      "Program generation exhausted all attempts without producing a valid program.",
    );
  } catch (err) {
    console.error("Program worker failed", {
      interviewId,
      err,
    });

    await markFailed(interviewId, err);

    return;
  }
};
