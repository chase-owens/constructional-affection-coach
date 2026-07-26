"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const jsonResponse_1 = __importDefault(require("../../util/jsonResponse"));
const client = new client_dynamodb_1.DynamoDBClient({});
const docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;
const USER_INDEX = "userId-updatedAt-index";
const handler = async (event) => {
    if (!TABLE_NAME) {
        return (0, jsonResponse_1.default)(500, {
            message: "TABLE_NAME environment variable not found",
        });
    }
    const userId = event.requestContext?.authorizer?.jwt?.claims?.sub;
    if (!userId) {
        return (0, jsonResponse_1.default)(401, {
            message: "Unauthorized",
        });
    }
    try {
        const result = await docClient.send(new lib_dynamodb_1.QueryCommand({
            TableName: TABLE_NAME,
            IndexName: USER_INDEX,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
            ScanIndexForward: false,
        }));
        return (0, jsonResponse_1.default)(200, {
            interviews: result.Items ?? [],
        });
    }
    catch (err) {
        console.error("GET INTERVIEWS ERROR", err);
        return (0, jsonResponse_1.default)(500, {
            message: "Failed to fetch interviews",
        });
    }
};
exports.handler = handler;
