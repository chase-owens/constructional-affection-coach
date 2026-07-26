"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionalAssetsController = void 0;
const instructions_1 = require("./instructions");
const schemas_1 = require("../../../schemas");
const errors_1 = require("../../../program/errors");
const constructionalAssetsPrompt = `
${instructions_1.CONSTRUCTIONAL_ASSETS_INSTRUCTIONS}

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
class ConstructionalAssetsController {
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
                    content: constructionalAssetsPrompt,
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
        const reuslt = schemas_1.constructionalAssetsPhaseResultSchema.safeParse(normalizedJson);
        if (!reuslt.success) {
            throw new errors_1.InterviewPhaseValidationError("constructional_assets", reuslt.error);
        }
        return reuslt.data;
    }
}
exports.ConstructionalAssetsController = ConstructionalAssetsController;
