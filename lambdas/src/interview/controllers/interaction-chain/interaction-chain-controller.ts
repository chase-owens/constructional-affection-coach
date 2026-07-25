import OpenAI from "openai";
import { INTERACTION_CHAIN_INSTRUCTIONS } from "./instructions";
import { interactionChainPhaseResultSchema } from "../../../schemas";
import type { ValidationIssue } from "../../../validation/types";
import { InterviewPhaseValidationError } from "../../../program/errors";

export type InterviewMessage = {
  role: "coach" | "user";
  content: string;
};

const interactionChainPrompt = `
${INTERACTION_CHAIN_INSTRUCTIONS}

Use the exact key "phaseComplete".
Do not use "phaseCompleted".

Return ONLY valid JSON matching one of these shapes:

{
  "coachMessage": "...",
  "phaseComplete": false
}

or

{
  "phaseComplete": true,
  "interactionChain": {
    "steps": [
      {
        "index": 0,
        "actor": "person",
        "description": "...",
        "change": "...",
        "expectedDogBehavior": "...",
        "targetPatternPresent": true,
        "requiresTransfer": false,
        "notes": "..."
      }
    ],
    "constructionStartIndex": 0,
    "targetOutcomeIndex": 0,
    "notes": "..."
  }
}

Do not output markdown.
Do not output explanations.
Return only JSON.
Always ensure a phaseComplete key is in the output.
Return JSON with phaseComplete
`;

export class InteractionChainController {
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
          content: interactionChainPrompt,
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

    const result = interactionChainPhaseResultSchema.safeParse(normalizedJson);

    if (!result.success) {
      throw new InterviewPhaseValidationError(
        "interaction_chain",
        result.error,
      );
    }

    return result.data;
  }
}
