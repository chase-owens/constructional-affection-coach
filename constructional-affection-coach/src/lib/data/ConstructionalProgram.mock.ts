import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

export const constructionalProgramMock: ConstructionalProgram = {
	constructionalAssets: {
		conditionsWhereTargetPatternOccurs: [
			{
				behaviorObserved: "Sits",
				description: "Standing upright with hands clasped",
				notes: "Occurs without the need for food, indicating some existing control."
			}
		],
		notes:
			"The dog clearly enjoys petting, scratches, belly rubs, and praise, which can support the desired interaction.",
		relevantSkills: [
			{
				context: "When food is present or when the person stands upright with hands clasped",
				name: "Sit and lie down on command",
				notes: "The dog reliably follows these cues in certain contexts."
			}
		],
		socialReinforcers: {
			eyeContact: "unclear",
			proximity: "unclear",
			talk: "clearly_reinforcing",
			touch: "clearly_reinforcing"
		}
	},
	controlAnalysis: {
		disturbingPattern:
			"Dog begins moving toward couch, jumping, or initiating play biting as person bends knees.",
		initialConditions: {
			behaviorObserved: "Dog sits calmly near person, not jumping or initiating unwanted behavior.",
			controllingConditions: ["Person standing upright", "Hands clasped", "Facing couch"],
			description: "Person standing upright near couch, facing couch, with hands clasped.",
			evidence: [
				"Dog reliably sits when person stands with hands clasped",
				"Dog remains calm as person approaches and turns"
			],
			relevantReinforcer: "Petting and praise when dog sits calmly"
		},
		targetPattern:
			"Dog sits or lies down calmly next to or on the couch while the person sits watching TV, occasionally shifting position but remaining settled.",
		terminalConditions: {
			description:
				"Person seated on couch watching TV, allowing dog to sit or lie down next to or on couch with controlled shifting.",
			targetPattern:
				"Dog remains sitting or lying down calmly, shifting positions without jumping or unwanted behavior throughout entire sitting period."
		},
		transitionPoint: {
			changedCondition: "Person begins bending knees toward couch",
			stepIndex: 2
		}
	},
	initialization: {
		readinessCriterion:
			"Dog maintains calm sitting pattern reliably while person stands facing couch with hands clasped, at least 90% of the time over three consecutive sessions",
		startingInteraction: {
			conditions: [
				"Person stands upright near the couch facing the couch with hands clasped",
				"Dog sits calmly near the person"
			],
			controlCriterion:
				"Dog sits calmly for at least 30 seconds across multiple repetitions without losing calmness",
			reinforcer: "Petting and verbal praise while dog has all four feet on the ground",
			targetPattern: "Dog remains sitting calmly near person without jumping or unwanted behavior"
		}
	},
	schemaVersion: "1.0",
	targetOutcome: {
		clarifiedOutcome:
			"When you sit on the couch watching TV, your dog is either sitting or lying down beside you on the floor or on the couch, shifting position occasionally while remaining settled.",
		desiredInteractionPattern:
			"Dog sits or lies down next to or on the couch with the person as they watch TV, with occasional shifting while remaining seated or lying down.",
		isObservable: true,
		isPositive: true,
		notes:
			"The pattern includes allowed movement such as shifting position while preserving sitting or lying down near the person.",
		primaryContext: "Sitting on the couch watching TV at home",
		rawAnswer:
			"When I sit on the couch to watch TV, my dog would be sitting or lying down on the floor next to the couch or on the couch with me, allowed to shift positions but not jump on me.",
		scope: "within_constructional_affection"
	},
	transferPlan: {
		phases: [
			{
				approximations: [
					{
						changeFromPrevious: {
							adjustment: "Shift weight forward slightly from fully upright stance",
							dimension: "posture"
						},
						conditions: [
							"Person shifts weight slightly forward while remaining mostly upright",
							"Dog sits calmly near person"
						],
						controlCriterion: {
							evidenceOfControl:
								"Dog remains sitting calmly for 15 seconds while person shifts weight",
							sufficientToAdvance: "Dog reliably maintains calm sitting for three repetitions"
						},
						id: "phase1_approx1",
						order: 0,
						recovery: {
							previousSuccessfulApproximationId: "phase1_approx1",
							reduceApproximationTo: "phase1_approx1"
						},
						reinforcer: "Petting with one hand and verbal praise when dog remains sitting calmly",
						targetPattern: "Dog continues calm sitting with no jumping or excitement"
					},
					{
						changeFromPrevious: {
							adjustment: "Slight knee bend from partial weight shift",
							dimension: "posture"
						},
						conditions: [
							"Person begins slight knee bend, approx 10 degrees",
							"Dog sits calmly near person"
						],
						controlCriterion: {
							evidenceOfControl:
								"Dog maintains sitting for 10 seconds while person bends knees slightly",
							sufficientToAdvance: "Dog demonstrates stable calm pattern over three sessions"
						},
						id: "phase1_approx2",
						order: 1,
						recovery: {
							previousSuccessfulApproximationId: "phase1_approx1",
							reduceApproximationTo: "phase1_approx1"
						},
						reinforcer: "Petting and verbal praise contingent on calm sitting",
						targetPattern: "Dog remains sitting calmly without moving toward couch or jumping"
					},
					{
						changeFromPrevious: {
							adjustment: "Increase knee bend from slight to moderate",
							dimension: "posture"
						},
						conditions: [
							"Person bends knees slightly more, approx 20 degrees",
							"Dog sits calmly near person"
						],
						controlCriterion: {
							evidenceOfControl: "Dog remains calm for 10+ seconds during moderate knee bend",
							sufficientToAdvance: "Consistent calm on three separate occasions"
						},
						id: "phase1_approx3",
						order: 2,
						recovery: {
							previousSuccessfulApproximationId: "phase1_approx2",
							reduceApproximationTo: "phase1_approx2"
						},
						reinforcer: "Two-handed petting and verbal praise while dog sits or lies down",
						targetPattern: "Dog stays calm and seated without jumping or play biting"
					}
				],
				entryCondition:
					"Person stands upright near couch facing couch with hands clasped; dog sits calmly.",
				id: "phase1",
				notes: "Gradually introduce lowering posture while maintaining calm dog behavior.",
				order: 0,
				reinforcers: ["Petting", "Verbal praise"],
				targetPattern:
					"Dog continues sitting calmly near person despite beginning changes in person's posture.",
				terminalCriterion:
					"Dog sits calmly for at least 10 seconds after person begins bending knees slightly.",
				title: "Transfer from standing facing couch to beginning to bend knees"
			},
			{
				approximations: [
					{
						changeFromPrevious: {
							adjustment: "Partial sitting on couch edge for 1 second",
							dimension: "human posture"
						},
						conditions: [
							"Person sits briefly (1 second) on couch edge",
							"Dog remains sitting or lying calmly near couch"
						],
						controlCriterion: {
							evidenceOfControl: "Dog remains calm for the duration of person sitting briefly",
							sufficientToAdvance: "Three repetitions without disturbance"
						},
						id: "phase2_approx1",
						order: 0,
						recovery: {
							previousSuccessfulApproximationId: "phase1_approx3",
							reduceApproximationTo: "phase1_approx3"
						},
						reinforcer: "Two-handed petting during calm dog behavior",
						targetPattern: "Dog remains calm and seated or lying down throughout"
					},
					{
						changeFromPrevious: {
							adjustment: "Increase sitting duration from 1 to 5 seconds",
							dimension: "duration"
						},
						conditions: [
							"Person sits on couch edge for 5 seconds",
							"Dog remains sitting or lying calmly"
						],
						controlCriterion: {
							evidenceOfControl: "Dog remains calm for entire 5-second duration",
							sufficientToAdvance: "Consistent calm across three sessions"
						},
						id: "phase2_approx2",
						order: 1,
						recovery: {
							previousSuccessfulApproximationId: "phase2_approx1",
							reduceApproximationTo: "phase2_approx1"
						},
						reinforcer: "Ongoing petting and praise supporting calm behavior",
						targetPattern: "Calm sitting or lying with allowed position shifts"
					},
					{
						changeFromPrevious: {
							adjustment: "Move from edge seat to full sit",
							dimension: "posture"
						},
						conditions: [
							"Person sits fully on couch",
							"Dog remains calm sitting or lying on or near couch"
						],
						controlCriterion: {
							evidenceOfControl: "Dog remains calmly seated or lying during person sitting",
							sufficientToAdvance: "Stable calm behavior over multiple trials"
						},
						id: "phase2_approx3",
						order: 2,
						recovery: {
							previousSuccessfulApproximationId: "phase2_approx2",
							reduceApproximationTo: "phase2_approx2"
						},
						reinforcer: "Full petting and verbal praise while dog remains calm",
						targetPattern: "Dog remains settled with position shifts allowed but no jumping"
					}
				],
				entryCondition: "Person bends knees moderately near couch; dog sits calmly.",
				id: "phase2",
				notes: "Introduce sitting with gradual duration increases.",
				order: 1,
				reinforcers: ["Petting with two hands", "Verbal praise"],
				targetPattern:
					"Dog remains sitting or lying calmly next to or on couch as person lowers onto couch seat.",
				terminalCriterion:
					"Dog sits or lies calmly for 10 seconds as person briefly sits on edge of couch.",
				title: "Transfer from bending knees to sitting on couch briefly"
			},
			{
				approximations: [
					{
						changeFromPrevious: {
							adjustment: "Slight posture shift in seating",
							dimension: "human posture"
						},
						conditions: [
							"Person shifts sitting posture slightly while dog remains nearby",
							"Dog remains calm seated or lying down"
						],
						controlCriterion: {
							evidenceOfControl: "Dog remains settled despite human posture shifts",
							sufficientToAdvance: "Three session stability"
						},
						id: "phase3_approx1",
						order: 0,
						recovery: {
							previousSuccessfulApproximationId: "phase3_approx1",
							reduceApproximationTo: "phase3_approx1"
						},
						reinforcer: "Petting and praise contingent on calmness",
						targetPattern: "Calm sitting or lying with allowed shifting"
					},
					{
						changeFromPrevious: {
							adjustment: "Reach for object near sitting area",
							dimension: "human movement"
						},
						conditions: [
							"Person reaches for remote control or small object near couch",
							"Dog remains calm sitting or lying"
						],
						controlCriterion: {
							evidenceOfControl: "Dog stays calm and does not jump or initiate play",
							sufficientToAdvance: "Stable calm across trials"
						},
						id: "phase3_approx2",
						order: 1,
						recovery: {
							previousSuccessfulApproximationId: "phase3_approx1",
							reduceApproximationTo: "phase3_approx1"
						},
						reinforcer: "Petting and verbal praise",
						targetPattern: "Dog maintains calm sitting or lying"
					},
					{
						changeFromPrevious: {
							adjustment: "Long duration of natural sitting while watching TV",
							dimension: "duration and natural context"
						},
						conditions: [
							"Person watches TV naturally for extended duration (10+ minutes)",
							"Dog remains calm seated or lying next to or on couch"
						],
						controlCriterion: {
							evidenceOfControl: "Dog maintains calm pattern throughout session",
							sufficientToAdvance: "Sustained calm across multiple sessions"
						},
						id: "phase3_approx3",
						order: 2,
						recovery: {
							previousSuccessfulApproximationId: "phase3_approx2",
							reduceApproximationTo: "phase3_approx2"
						},
						reinforcer: "Ongoing gentle petting and praise as needed",
						targetPattern: "Dog remains calm, occasionally shifting but not jumping"
					}
				],
				entryCondition: "Person seated fully on couch; dog calm and settled.",
				id: "phase3",
				notes: "Introduce natural variations in human behavior for durable control.",
				order: 2,
				reinforcers: ["Petting", "Verbal praise"],
				targetPattern:
					"Dog maintains calm sitting or lying down with occasional shifting as person interacts naturally in sitting context.",
				terminalCriterion:
					"Dog remains calm during at least 10 minutes of natural sitting behavior including posture shifts, use of remote, and watching TV.",
				title: "Generalize calm sitting pattern during natural sitting behavior"
			}
		],
		terminalCriterion:
			"Dog remains consistently calm, sitting or lying down with allowed shifting, throughout the entire typical duration of sitting on couch watching TV."
	}
};
