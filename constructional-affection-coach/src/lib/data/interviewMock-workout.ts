import type {
	ConstructionalAssets,
	InteractionChain,
	TargetOutcome
} from "../../../../lambdas/src/schemas";

const mockInterview = {
	targetOutcome: {
		rawAnswer:
			"I want her to be sitting or lying in her bed a few feet away from me on the floor during my workouts, allowing some movement but no jumping on me, walking on me, or play biting me, especially while I am doing pushups or situps on the floor.",
		clarifiedOutcome:
			"During at-home workouts when I'm on the floor doing pushups or situps, my dog will be sitting or lying in her bed a few feet away, with some permitted movement but no jumping on me, walking on me, or play biting me.",
		desiredInteractionPattern:
			"The dog remains in her bed a few feet away while the person performs floor exercises, intermittently sitting or lying down and occasionally shifting position without jumping on, walking on, or play biting the person.",
		primaryContext:
			"At home during workout sessions involving floor exercises such as pushups and situps",
		scope: "within_constructional_affection",
		isPositive: true,
		isObservable: true,
		notes:
			"The target permits some movement within the bed while preserving sitting or lying down and remaining separate from the person's workout space."
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
				name: "Sit",
				context:
					"When food is present, on command, or when the person stands upright with hands clasped",
				notes: "Calm sitting is reliable in these contexts."
			},
			{
				name: "Lie down",
				context: "During rest and on command",
				notes: "Calm lying down occurs naturally and when requested."
			}
		],

		conditionsWhereTargetPatternOccurs: [
			{
				description: "The person stands calmly with hands clasped near the workout area",
				behaviorObserved: "The dog remains calm and sits nearby",
				notes: "This provides an available calm starting interaction."
			},
			{
				description: "During normal rest periods",
				behaviorObserved: "The dog lies down calmly",
				notes: "This shows lying down is already part of the dog's repertoire."
			}
		],

		notes:
			"The dog clearly enjoys petting, scratches, belly rubs, and gentle praise. Calm sitting and lying occur reliably in several contexts, while the unwanted pattern begins when the person moves toward the floor."
	},

	interactionChain: {
		steps: [
			{
				index: 0,
				actor: "person",
				description: "Stand in the workout area while stretching or lifting weights.",
				change: "The person remains upright before beginning floor exercises.",
				expectedDogBehavior:
					"The dog remains calm without jumping, walking on the person, or play biting.",
				targetPatternPresent: true,
				requiresTransfer: false,
				notes:
					"The dog is calm while the person remains upright, so this is the last successful part of the interaction."
			},
			{
				index: 1,
				actor: "person",
				description: "Begin bending or lowering toward the floor.",
				change:
					"The person's posture and height change from standing toward a floor-workout position.",
				expectedDogBehavior:
					"The dog begins running around, walking on the person, jumping, or initiating play biting.",
				targetPatternPresent: false,
				requiresTransfer: true,
				notes:
					"This is the earliest identified change where the target pattern deteriorates."
			}
		],

		constructionStartIndex: 0,
		targetOutcomeIndex: 1,

		notes:
			"The interaction remains stable while the person is upright. Transfer should begin from standing and gradually introduce smaller changes in posture and height before progressing to floor exercises."
	}
} satisfies {
	targetOutcome: TargetOutcome;
	constructionalAssets: ConstructionalAssets;
	interactionChain: InteractionChain;
};

export default mockInterview;
