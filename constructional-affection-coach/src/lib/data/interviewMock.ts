import type {
	ConstructionalAssets,
	InteractionChain,
	TargetOutcome
} from "../../../../lambdas/src/domain";

const mockInterview = {
	targetOutcome: {
		rawAnswer:
			"When I sit on the couch to watch TV, my dog would be sitting or lying down on the floor next to the couch or on the couch with me, allowed to shift positions but not jump on me.",
		clarifiedOutcome:
			"When you sit on the couch watching TV, your dog is either sitting or lying down beside you on the floor or on the couch, shifting position occasionally while remaining settled.",
		desiredInteractionPattern:
			"Dog sits or lies down next to or on the couch with the person as they watch TV, with occasional shifting while remaining seated or lying down.",
		primaryContext: "Sitting on the couch watching TV at home",
		scope: "within_constructional_affection",
		isPositive: true,
		isObservable: true,
		notes:
			"The pattern includes allowed movement such as shifting position while preserving sitting or lying down near the person."
	},

	constructionalAssets: {
		socialReinforcers: {
			touch: "clearly_reinforcing",
			talk: "clearly_reinforcing",
			eyeContact: "unclear",
			proximity: "unclear"
		},

		relevantSkills: [
			{
				name: "Sit and lie down on command",
				context: "When food is present or when the person stands upright with hands clasped",
				notes: "The dog reliably follows these cues in certain contexts."
			}
		],

		conditionsWhereTargetPatternOccurs: [
			{
				description: "Standing upright with hands clasped",
				behaviorObserved: "Sits",
				notes: "Occurs without the need for food, indicating some existing control."
			}
		],

		notes:
			"The dog clearly enjoys petting, scratches, belly rubs, and praise, which can support the desired interaction."
	},

	interactionChain: {
		steps: [
			{
				index: 0,
				actor: "person",
				description: "Walk toward the couch.",
				change: "The person moves closer to the sitting area.",
				expectedDogBehavior: "The dog remains calm and stays away from the couch.",
				targetPatternPresent: true,
				requiresTransfer: false,
				notes: "The target pattern is still present while the person approaches."
			},
			{
				index: 1,
				actor: "person",
				description: "Turn around to face the couch.",
				change: "The person's orientation changes toward sitting.",
				expectedDogBehavior: "The dog remains calm and stays in place.",
				targetPatternPresent: true,
				requiresTransfer: false,
				notes: "The dog remains under control as the person turns toward the couch."
			},
			{
				index: 2,
				actor: "person",
				description: "Begin to bend the knees toward the couch.",
				change: "The person's posture and height begin changing toward sitting.",
				expectedDogBehavior:
					"The dog begins moving toward the couch, jumping, or initiating play biting.",
				targetPatternPresent: false,
				requiresTransfer: true,
				notes:
					"This is the earliest identified change where the target pattern begins to deteriorate."
			}
		],

		constructionStartIndex: 1,
		targetOutcomeIndex: 2,

		notes:
			"The interaction is stable until the person begins bending toward the couch. The transfer should begin from the successful turning condition and gradually introduce smaller changes in posture and height."
	}
} satisfies {
	targetOutcome: TargetOutcome;
	constructionalAssets: ConstructionalAssets;
	interactionChain: InteractionChain;
};

export default mockInterview;
