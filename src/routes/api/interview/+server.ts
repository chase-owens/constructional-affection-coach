import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import {
	runConstructionalAssetsInterview,
	runInteractionChainInterview,
	runProgramInitialization,
	runTargetOutcomeInterview
} from '$lib/server/interview';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { phase, messages, constructionalAssets, interactionChain, targetOutcome } =
			await request.json();
		console.log('🚀 ~ POST ~ phase:', phase, constructionalAssets, interactionChain, targetOutcome);

		switch (phase) {
			case 'target_outcome':
				return runTargetOutcomeInterview(openai, messages);
			case 'constructional_assets':
				return runConstructionalAssetsInterview(openai, messages);
			case 'interaction_chain':
				return runInteractionChainInterview(openai, messages);
			case 'program_initialization':
				return runProgramInitialization(openai, {
					targetOutcome,
					constructionalAssets,
					interactionChain
				});

			default:
				return json({ error: `Unknown interview phase: ${phase}` }, { status: 400 });
		}
	} catch (error) {
		console.error(error);

		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
