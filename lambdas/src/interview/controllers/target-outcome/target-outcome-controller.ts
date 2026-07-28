import OpenAI from "openai";
import { TARGET_OUTCOME_INSTRUCTIONS } from "./instructions";
import { targetOutcomePhaseResultSchema } from "@constructional-affection/domain";
import { InterviewPhaseValidationError } from "../../../program/errors";
import type { ValidationIssue } from "../../../validation/types";
export type InterviewMessage = {
  role: "coach" | "user";
  content: string;
};

const targetOutcomePrompt = `

${TARGET_OUTCOME_INSTRUCTIONS}

When the completion criteria are satisfied,
complete the phase.

Do not ask the user whether the phase should end.

Return ONLY valid JSON matching one of these shapes:

{
  "coachMessage": "...",
  "phaseComplete": false
}

or

{
  "coachMessage": "...",
  "phaseComplete": true,
  "targetOutcome": {
    "rawAnswer": "...",
    "clarifiedOutcome": "...",
    "desiredInteractionPattern": "...",
    "targetActions: ["..."],
    "primaryContext": "... or null",
    "scope": "within_constructional_affection",
    "isPositive": true,
    "isObservable": true,
    "notes": "..."
  }
}

or

{
  "coachMessage": "...",
  "phaseComplete": true,
  "outsideScope": true,
  "reason": "..."
}

Do not output markdown.
Do not output explanations.
Return only JSON.
`;

export class TargetOutcomeController {
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
          content: targetOutcomePrompt,
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

    const result = targetOutcomePhaseResultSchema.safeParse(normalizedJson);

    if (!result.success) {
      throw new InterviewPhaseValidationError("target_outcome", result.error);
    }

    return result.data;
  }
}
