"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAiClient = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const openai_1 = __importDefault(require("openai"));
const secretsManager = new client_secrets_manager_1.SecretsManagerClient({});
let openAiClient = null;
const getOpenAiClient = async () => {
    if (openAiClient) {
        return openAiClient;
    }
    const secretArn = process.env.OPENAI_SECRET_ARN;
    if (!secretArn) {
        throw new Error("OPENAI_SECRET_ARN is not configured.");
    }
    const response = await secretsManager.send(new client_secrets_manager_1.GetSecretValueCommand({
        SecretId: secretArn,
    }));
    if (!response.SecretString) {
        throw new Error("OpenAI secret does not contain a SecretString.");
    }
    const secret = JSON.parse(response.SecretString);
    if (!secret.OPENAI_API_KEY) {
        throw new Error("Secret is missing OPENAI_API_KEY.");
    }
    openAiClient = new openai_1.default({
        apiKey: secret.OPENAI_API_KEY,
    });
    return openAiClient;
};
exports.getOpenAiClient = getOpenAiClient;
