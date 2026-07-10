import OpenAI from 'openai';
import { programInitializationPhaseResultSchema } from '$lib/schemas';
import { PROGRAM_INITIALIZATION_INSTRUCTIONS } from './instructions';
import type { ConstructionalAssets, InteractionChain, TargetOutcome } from '$lib/domain';

type ProgramInitializationInput = {
	targetOutcome: TargetOutcome;
	constructionalAssets: ConstructionalAssets;
	interactionChain: InteractionChain;
};

const programInitializationPrompt = `
${PROGRAM_INITIALIZATION_INSTRUCTIONS}

Use the exact key "phaseComplete".

Return ONLY valid JSON in this shape:

{
  "phaseComplete": true,
  "programInitialization": {
    "startingPoint": "...",
    "terminalTargetPattern": "...",
    "programStages": [
      {
        "index": 0,
        "title": "...",
        "targetPattern": "...",
        "entryCondition": "...",
        "successCriterion": "...",
        "reinforcers": ["..."],
        "notes": "..."
      }
    ],
    "rationale": "...",
    "notes": "..."
  }
}

Do not output markdown.
Do not output explanations.
Always return phaseComplete key
Return only JSON.
`;

export class ProgramInitializationController {
	constructor(private readonly openai: OpenAI) {}

	async initialize(input: ProgramInitializationInput) {
		const response = await this.openai.responses.create({
			model: 'gpt-4.1-mini',
			input: [
				{
					role: 'system' as const,
					content: programInitializationPrompt
				},
				{
					role: 'user' as const,
					content: JSON.stringify(input)
				}
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

		return programInitializationPhaseResultSchema.parse(normalizedJson);
	}
}
