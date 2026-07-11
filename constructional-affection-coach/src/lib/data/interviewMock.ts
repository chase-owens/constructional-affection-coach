import type {
	ConstructionalAssets,
	InteractionChain,
	TargetOutcome
} from '../../../../lambdas/src/domain';

const mockInterview = {
	targetOutcome: {
		rawAnswer:
			"my dog would be calm when I sit on the couch to watch tv. she'd sit or lie on the floor or on the couch with me",
		clarifiedOutcome:
			'When watching TV on the couch in the living room, the dog is sitting or lying down quietly on the floor or on the couch with the person.',
		desiredInteractionPattern:
			'The person sits on the couch to watch TV in the living room while the dog calmly sits or lies on the floor or couch beside them.',
		primaryContext: 'Watching TV on the couch in the living room',
		scope: 'within_constructional_affection',
		isPositive: true,
		isObservable: true,
		notes:
			"The dog's calm posture is defined as sitting or lying near the person while watching TV."
	},
	constructionalAssets: {
		socialReinforcers: {
			touch: 'clearly_reinforcing',
			talk: 'clearly_reinforcing',
			eyeContact: 'sometimes_reinforcing',
			proximity: 'clearly_reinforcing'
		},
		relevantSkills: [
			{
				name: 'sit',
				context: 'when asked, when food is present, or when the person stands with hands clasped',
				notes: 'Responds reliably to the cue and some situational signals'
			}
		],
		conditionsWhereTargetPatternOccurs: [
			{
				description: 'When given a sit cue or when food is present',
				behaviorObserved: 'She sits calmly',
				notes: 'Sitting already occurs reliably in these conditions'
			}
		],
		notes: 'Touch, talking, and proximity can be incorporated into the interaction.'
	},
	interactionChain: {
		steps: [
			{
				index: 0,
				actor: 'person',
				description: 'Walk toward the couch.',
				change: 'The person approaches the couch.',
				expectedDogBehavior: 'The dog stands or remains calmly nearby.',
				targetPatternPresent: true,
				requiresTransfer: false,
				notes: 'The dog is still calm at this point.'
			},
			{
				index: 1,
				actor: 'person',
				description: 'Turn around and begin sitting on the couch.',
				change: "The person's movement predicts sitting down.",
				expectedDogBehavior: 'The dog becomes excited, runs up, and jumps onto the couch.',
				targetPatternPresent: false,
				requiresTransfer: true,
				notes: 'This is the earliest point where the interaction shifts away from the target.'
			}
		],
		constructionStartIndex: 1,
		targetOutcomeIndex: 0,
		notes:
			'The starting arrangement should be built around the moment just before the person turns to sit.'
	}
} satisfies {
	targetOutcome: TargetOutcome;
	constructionalAssets: ConstructionalAssets;
	interactionChain: InteractionChain;
};

export default mockInterview;
