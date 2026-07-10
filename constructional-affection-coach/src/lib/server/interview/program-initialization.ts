import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { ProgramInitializationController } from './controllers/program-initialization';
import type { ConstructionalAssets, InteractionChain, TargetOutcome } from '$lib/domain';

export const runProgramInitialization = async (
	openai: OpenAI,
	input: {
		targetOutcome: TargetOutcome;
		constructionalAssets: ConstructionalAssets;
		interactionChain: InteractionChain;
	}
) => {
	const controller = new ProgramInitializationController(openai);
	const result = await controller.initialize(input);

	return json(result);
};
