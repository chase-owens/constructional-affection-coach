"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const jsonResponse_1 = __importDefault(require("../../util/jsonResponse"));
const logger_1 = require("../../shared/logger");
const dynamoClient = new client_dynamodb_1.DynamoDBClient({});
const documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoClient, {
    marshallOptions: { removeUndefinedValues: true },
});
const handler = async (event) => {
    const requestId = event.requestContext.requestId;
    const startedAt = Date.now();
    // if (event.requestContext?.http?.method === "OPTIONS") {
    //   return jsonResponse(200, { ok: true });
    // }
    const tableName = process.env.TABLE_NAME;
    if (!tableName) {
        return (0, jsonResponse_1.default)(500, {
            message: "Missing TABLE_NAME environment variable",
        });
    }
    try {
        const payload = JSON.parse(event.body || "{}");
        const interviewId = payload.interviewId.trim();
        if (!interviewId) {
            return (0, jsonResponse_1.default)(400, { message: "interviewId is required" });
        }
        const now = new Date().toISOString();
        await documentClient.send(new lib_dynamodb_1.PutCommand({
            TableName: tableName,
            Item: {
                interviewId: payload.interviewId.trim(),
                status: "pending",
                createdAt: now,
                updatedAt: now,
            },
            // this ensures we don't overwrite existing interviews
            ConditionExpression: "attribute_not_exists(interviewId)",
        }));
        logger_1.logger.info("interview.persistence.completed", {
            interviewId: payload.interviewId,
            requestId,
            druationMs: Date.now() - startedAt,
        });
        return (0, jsonResponse_1.default)(201, { interviewId, status: "pending" });
    }
    catch (err) {
        if (err instanceof Error &&
            err.name === "ConditionalCheckFailedException") {
            return (0, jsonResponse_1.default)(409, {
                message: "Interview already exists",
            });
        }
        logger_1.logger.error("interview.creation.failed", {
            requestId,
            durationMs: Date.now() - startedAt,
            errorName: err instanceof Error ? err.name : "UnknownError",
            errorMessage: err instanceof Error ? err.message : "Unknown persistence error",
        });
        return (0, jsonResponse_1.default)(500, {
            message: "Failed to create interview",
        });
    }
};
exports.handler = handler;
