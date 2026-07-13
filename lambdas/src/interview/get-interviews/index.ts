import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import jsonResponse from "../../util/jsonResponse";

const client = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event: any) => {
  if (!TABLE_NAME) {
    return jsonResponse(500, {
      message: "TABLE_NAME environment variable not found",
    });
  }

  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME }),
    );

    const interviews = (result.Items ?? []).sort((a, b) =>
      String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
    );

    return jsonResponse(200, { interviews });
  } catch (err) {
    console.error("GET INTERVIEWS ERROR", JSON.stringify(err, null, 2));

    return jsonResponse(500, { message: "Failed to fech interviews" });
  }
};
