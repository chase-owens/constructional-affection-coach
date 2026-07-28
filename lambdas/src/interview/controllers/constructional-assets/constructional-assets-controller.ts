import OpenAI from "openai";
import { CONSTRUCTIONAL_ASSETS_INSTRUCTIONS } from "./instructions";
import { constructionalAssetsPhaseResultSchema } from "@constructional-affection/domain";
import type { ValidationIssue } from "../../../validation/types";
import { InterviewPhaseValidationError } from "../../../program/errors";
import type { TargetOutcome } from "@constructional-affection/domain";

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
      "evidence": ["..."],
      "reinforcers": {
        "touch": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing",
        "talk": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing",
        "eyeContact": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing",
        "proximity": "clearly_reinforcing | sometimes_reinforcing | unclear | not_reinforcing | over_arousing"
        }
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
    targetOutcome: TargetOutcome,
    validationIssues?: ValidationIssue[],
  ) {
    const correctionMessage = validationIssues?.length
      ? {
          role: "system" as const,
          content: `
            The previous response failed schema validation.

            Correct these issues:
            ${validationIssues
              .map(
                (issue) =>
                  `- ${issue.path.map(String).join(".")}: ${issue.message}`,
              )
              .join("\n")}

            Return only corrected JSON matching the required response shape.
        `.trim(),
        }
      : undefined;

    const response = await this.openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system" as const, content: constructionalAssetsPrompt },
        {
          role: "system" as const,
          content: `

          The Target Outcome established in the previous phase is

          ${JSON.stringify(targetOutcome, null, 2)}

          Use this Target Outcome as the reference point when identifying existing behaviors, interaction patterns, and conditions that the program can build from.

        `.trim(),
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

    const result =
      constructionalAssetsPhaseResultSchema.safeParse(normalizedJson);

    if (!result.success) {
      throw new InterviewPhaseValidationError(
        "constructional_assets",
        result.error,
      );
    }

    return result.data;
  }
}
