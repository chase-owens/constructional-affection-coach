import OpenAI from 'openai';
import { json } from '@sveltejs/kit';
import { TargetOutcomeController, type InterviewMessage } from './controllers/target-outcome';

export const runTargetOutcomeInterview = async (openai: OpenAI, messages: InterviewMessage[]) => {
	const controller = new TargetOutcomeController(openai);
	const result = await controller.interview(messages);

	return json(result);
};
