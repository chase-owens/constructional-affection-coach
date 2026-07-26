"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetOutcomeController = void 0;
const instructions_1 = require("./instructions");
const schemas_1 = require("../../../schemas");
const errors_1 = require("../../../program/errors");
const targetOutcomePrompt = `

${instructions_1.TARGET_OUTCOME_INSTRUCTIONS}

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
class TargetOutcomeController {
    openai;
    constructor(openai) {
        this.openai = openai;
    }
    async interview(messages, validationIssues) {
        const correctionMessage = validationIssues?.length
            ? {
                role: "system",
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
                    role: "system",
                    content: targetOutcomePrompt,
                },
                ...messages.map((message) => ({
                    role: message.role === "user"
                        ? "user"
                        : "assistant",
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
        const normalizedJson = "phaseComplete" in parsedJson
            ? parsedJson
            : { ...parsedJson, phaseComplete: false };
        const result = schemas_1.targetOutcomePhaseResultSchema.safeParse(normalizedJson);
        if (!result.success) {
            throw new errors_1.InterviewPhaseValidationError("target_outcome", result.error);
        }
        return result.data;
    }
}
exports.TargetOutcomeController = TargetOutcomeController;
