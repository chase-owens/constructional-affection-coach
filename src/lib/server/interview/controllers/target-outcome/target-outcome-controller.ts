import OpenAI from 'openai';
import { targetOutcomePhaseResultSchema } from '$lib/schemas';
import { TARGET_OUTCOME_INSTRUCTIONS } from './instructions';
export type InterviewMessage = {
	role: 'coach' | 'user';
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

	async interview(messages: InterviewMessage[]) {
		const response = await this.openai.responses.create({
			model: 'gpt-4.1-mini',
			input: [
				{
					role: 'system' as const,
					content: targetOutcomePrompt
				},
				...messages.map((message) => ({
					role: message.role === 'user' ? ('user' as const) : ('assistant' as const),
					content: message.content
				}))
			],
			text: {
				format: {
					type: 'json_object'
				}
			}
		});

		const parsedJson = JSON.parse(response.output_text);
		console.log(response.output_text);

		const normalizedJson =
			'phaseComplete' in parsedJson ? parsedJson : { ...parsedJson, phaseComplete: false };

		return targetOutcomePhaseResultSchema.parse(normalizedJson);
	}
}
