import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { InteractionChainController, type InterviewMessage } from './controllers/interaction-chain';

export const runInteractionChainInterview = async (
	openai: OpenAI,
	messages: InterviewMessage[]
) => {
	const controller = new InteractionChainController(openai);
	const result = await controller.interview(messages);

	return json(result);
};
