import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { ProgramInitializationController } from './controllers/program-initialization';

export const runProgramInitialization = async (
	openai: OpenAI,
	input: {
		targetOutcome: unknown;
		constructionalAssets: unknown;
		interactionChain: unknown;
	}
) => {
	const controller = new ProgramInitializationController(openai);
	const result = await controller.initialize(input);

	return json(result);
};
