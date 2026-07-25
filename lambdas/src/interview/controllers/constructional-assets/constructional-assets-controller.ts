import OpenAI from "openai";
import { CONSTRUCTIONAL_ASSETS_INSTRUCTIONS } from "./instructions";
import { constructionalAssetsPhaseResultSchema } from "../../../schemas";
import type { ValidationIssue } from "../../../validation/types";
import { InterviewPhaseValidationError } from "../../../program/errors";

export type InterviewMessage = {
  role: "coach" | "user";
  content: string;
};

const constructionalAssetsPrompt = `
${CONSTRUCTIONAL_ASSETS_INSTRUCTIONS}

Return ONLY valid JSON matching one of these shapes:

{
  "coachMessage": "...",
  "phaseComplete": false
}

or

{
  "phaseComplete": true,
  "constructionalAssets": {
    "socialReinforcers": {
      "touch": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing",
      "talk": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing",
      "eyeContact": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing",
      "proximity": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing"
    },
    "relevantSkills": [
      {
        "name": "...",
        "context": "...",
        "notes": "..."
      }
    ],
    "conditionsWhereTargetPatternOccurs": [
      {
        "description": "...",
        "behaviorObserved": "...",
        "notes": "..."
      }
    ],
    "notes": "..."
  }
}

Do not output markdown.
Do not output explanations.
Use the exact key "phaseComplete". Do not use "phaseCompleted".
Return only JSON.
`;

export class ConstructionalAssetsController {
  constructor(private readonly openai: OpenAI) {}

  async interview(
    messages: InterviewMessage[],
    validationIssues?: ValidationIssue[],
  ) {
    const correctionMessage = validationIssues?.length
      ? {
          role: "system" as const,
          content: `
The previous response failed schema validation.

Correct these issues:
${validationIssues
  .map((issue) => `- ${issue.path.map(String).join(".")}: ${issue.message}`)
  .join("\n")}

Return only corrected JSON matching the required response shape.
        `.trim(),
        }
      : undefined;

    const response = await this.openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system" as const,
          content: constructionalAssetsPrompt,
        },
        ...messages.map((message) => ({
          role:
            message.role === "user"
              ? ("user" as const)
              : ("assistant" as const),
          content: message.content,
        })),
        ...(correctionMessage ? [correctionMessage] : []),
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const parsedJson = JSON.parse(response.output_text);
    console.log(response.output_text);

    const normalizedJson =
      "phaseComplete" in parsedJson
        ? parsedJson
        : { ...parsedJson, phaseComplete: false };

    const reuslt =
      constructionalAssetsPhaseResultSchema.safeParse(normalizedJson);

    if (!reuslt.success) {
      throw new InterviewPhaseValidationError(
        "constructional_assets",
        reuslt.error,
      );
    }

    return reuslt.data;
  }
}
