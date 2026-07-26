"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const jsonResponse_1 = __importDefault(require("../../util/jsonResponse"));
const client = new client_dynamodb_1.DynamoDBClient();
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;
const handler = async (event) => {
    if (!TABLE_NAME) {
        return (0, jsonResponse_1.default)(500, {
            message: "TABLE_NAME environment variable not found",
        });
    }
    const interviewId = event.pathParameters?.interviewId;
    if (!interviewId) {
        return (0, jsonResponse_1.default)(400, { message: "interviewId is requried" });
    }
    try {
        const result = await docClient.send(new lib_dynamodb_1.GetCommand({ TableName: TABLE_NAME, Key: { interviewId } }));
        if (!result.Item) {
            return (0, jsonResponse_1.default)(404, { message: "Interview not found" });
        }
        return (0, jsonResponse_1.default)(200, { interview: result.Item });
    }
    catch (err) {
        console.error("GET INTERVIEW ERROR", {
            interviewId,
            error: err instanceof Error ? err.message : "Unknown error",
        });
        return (0, jsonResponse_1.default)(500, { message: "Failed to fech interview" });
    }
};
exports.handler = handler;
