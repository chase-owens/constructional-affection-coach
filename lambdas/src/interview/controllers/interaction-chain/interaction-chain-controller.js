"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionChainController = void 0;
const instructions_1 = require("./instructions");
const schemas_1 = require("../../../schemas");
const errors_1 = require("../../../program/errors");
const interactionChainPrompt = `
${instructions_1.INTERACTION_CHAIN_INSTRUCTIONS}

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
class InteractionChainController {
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
                    content: interactionChainPrompt,
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
        const result = schemas_1.interactionChainPhaseResultSchema.safeParse(normalizedJson);
        if (!result.success) {
            throw new errors_1.InterviewPhaseValidationError("interaction_chain", result.error);
        }
        return result.data;
    }
}
exports.InteractionChainController = InteractionChainController;
