import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import OpenAI from "openai";

const secretsManager = new SecretsManagerClient({});

type OpenAiSecret = {
  OPENAI_API_KEY: string;
};

let openAiClient: OpenAI | null = null;

export const getOpenAiClient = async (): Promise<OpenAI> => {
  if (openAiClient) {
    return openAiClient;
  }

  const secretArn = process.env.OPENAI_SECRET_ARN;

  if (!secretArn) {
    throw new Error("OPENAI_SECRET_ARN is not configured.");
  }

  const response = await secretsManager.send(
    new GetSecretValueCommand({
      SecretId: secretArn,
    }),
  );

  if (!response.SecretString) {
    throw new Error("OpenAI secret does not contain a SecretString.");
  }

  const secret = JSON.parse(response.SecretString) as OpenAiSecret;

  if (!secret.OPENAI_API_KEY) {
    throw new Error("Secret is missing OPENAI_API_KEY.");
  }

  openAiClient = new OpenAI({
    apiKey: secret.OPENAI_API_KEY,
  });

  return openAiClient;
};
