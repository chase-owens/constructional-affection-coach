import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import {
	ConstructionalAssetsController,
	type InterviewMessage
} from './controllers/constructional-assets';

export const runConstructionalAssetsInterview = async (
	openai: OpenAI,
	messages: InterviewMessage[]
) => {
	const controller = new ConstructionalAssetsController(openai);
	const result = await controller.interview(messages);

	return json(result);
};
