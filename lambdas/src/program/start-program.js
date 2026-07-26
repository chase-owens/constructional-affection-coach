"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const get_openai_client_1 = require("../interview/get-openai-client");
const program_initialization_1 = require("../interview/program-initialization");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const constructional_program_1 = require("../schemas/constructional-program");
const errors_1 = require("../program/errors");
const documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}), {
    marshallOptions: { removeUndefinedValues: true },
});
const MAX_GENERATION_ATTEMPTS = 2;
const getErrorCode = (error) => {
    if (error instanceof Error &&
        "code" in error &&
        typeof error.code === "string") {
        return error.code;
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
const markProcessing = async (interviewId) => {
    const now = new Date().toISOString();
    await documentClient.send(new lib_dynamodb_1.UpdateCommand({
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
    }));
};
const markComplete = async (interviewId, program) => {
    const now = new Date().toISOString();
    await documentClient.send(new lib_dynamodb_1.UpdateCommand({
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
    }));
};
const markFailed = async (interviewId, error) => {
    const now = new Date().toISOString();
    const errorCode = getErrorCode(error);
    await documentClient.send(new lib_dynamodb_1.UpdateCommand({
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
    }));
    console.error("program.worker.failed", {
        interviewId,
        errorCode,
        errorName: error instanceof Error ? error.name : "UnknownError",
        errorMessage: error instanceof Error
            ? error.message
            : "Unknown program generation error",
    });
};
const handler = async (event) => {
    const { interviewId, targetOutcome, constructionalAssets, interactionChain } = event;
    if (!interviewId) {
        throw new Error("StartProgramEvent is missing interviewId.");
    }
    console.info("program.worker.started", {
        interviewId,
    });
    try {
        await markProcessing(interviewId);
        const openai = await (0, get_openai_client_1.getOpenAiClient)();
        let validationIssues;
        let lastValidationError;
        for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
            const result = await (0, program_initialization_1.runProgramInitialization)(openai, {
                targetOutcome,
                constructionalAssets,
                interactionChain,
                validationIssues,
            });
            if (!result.constructionalProgram) {
                throw new errors_1.ProgramGenerationError("Program generation completed without a constructional program.");
            }
            const parsedProgram = constructional_program_1.constructionalProgramSchema.safeParse(result.constructionalProgram);
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
            throw new errors_1.ProgramValidationError(lastValidationError);
        }
        throw new errors_1.ProgramGenerationError("Program generation exhausted all attempts without producing a valid program.");
    }
    catch (err) {
        console.error("Program worker failed", {
            interviewId,
            err,
        });
        await markFailed(interviewId, err);
        return;
    }
};
exports.handler = handler;
