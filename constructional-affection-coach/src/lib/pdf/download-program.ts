import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";
import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

type DownloadProgramPdfArgs = {
	constructionalProgram: ConstructionalProgram;
};

const buildPhaseContent = (constructionalProgram: ConstructionalProgram): Content[] =>
	constructionalProgram.transferPlan.phases.flatMap((phase, phaseIndex): Content[] => {
		const approximationContent: Content[] = phase.approximations.flatMap(
			(approximation, approximationIndex): Content[] => [
				{
					text: `Approximation ${approximationIndex + 1}`,
					style: "approximationTitle"
				},
				{
					text: `Conditions: ${approximation.conditions.join(", ")}`,
					style: "body"
				},
				{
					text: `Change: ${approximation.changeFromPrevious.dimension} — ${approximation.changeFromPrevious.adjustment}`,
					style: "body"
				},
				{
					text: `Target pattern: ${approximation.targetPattern}`,
					style: "body"
				},
				{
					text: `Reinforcer: ${approximation.reinforcer}`,
					style: "body"
				},
				{
					text: `Evidence of control: ${approximation.controlCriterion.evidenceOfControl}`,
					style: "body"
				},
				{
					text: `Advance when: ${approximation.controlCriterion.sufficientToAdvance}`,
					style: "body"
				},
				{ text: " ", margin: [0, 2, 0, 2] }
			]
		);

		return [
			{
				text: `Phase ${phaseIndex + 1}: ${phase.title}`,
				style: "phaseTitle"
			},
			{
				text: `Entry condition: ${phase.entryCondition}`,
				style: "body"
			},
			{
				text: `Target pattern: ${phase.targetPattern}`,
				style: "body"
			},
			{
				text: `Complete this phase when: ${phase.terminalCriterion}`,
				style: "body"
			},
			{
				text: `Reinforcers: ${phase.reinforcers.join(", ")}`,
				style: "body"
			},
			...(phase.notes
				? [
						{
							text: phase.notes,
							style: "muted"
						} satisfies Content
					]
				: []),
			...approximationContent,
			{ text: " ", margin: [0, 5, 0, 5] }
		];
	});

export const downloadProgramPdf = ({ constructionalProgram }: DownloadProgramPdfArgs) => {
	const { targetOutcome, constructionalAssets, controlAnalysis, initialization, transferPlan } =
		constructionalProgram;

	const phaseContent = buildPhaseContent(constructionalProgram);

	const docDefinition: TDocumentDefinitions = {
		pageMargins: [48, 48, 48, 48],

		content: [
			{
				text: "Constructional Affection Program",
				style: "title"
			},

			{
				text: "Target Outcome",
				style: "section"
			},
			{
				text:
					targetOutcome.desiredInteractionPattern ??
					targetOutcome.clarifiedOutcome ??
					targetOutcome.rawAnswer,
				style: "body"
			},
			{
				text: `Context: ${targetOutcome.primaryContext ?? "Not specified"}`,
				style: "muted"
			},

			{
				text: "What We Can Build From",
				style: "section"
			},
			{
				ul: constructionalAssets.relevantSkills.map((skill) =>
					skill.context ? `${skill.name} — ${skill.context}` : skill.name
				)
			},

			{
				text: "Control Analysis",
				style: "section"
			},
			{
				text: `Target pattern: ${controlAnalysis.targetPattern}`,
				style: "body"
			},
			{
				text: `Starting conditions: ${controlAnalysis.initialConditions.description}`,
				style: "body"
			},
			{
				text: `Behavior observed: ${controlAnalysis.initialConditions.behaviorObserved}`,
				style: "body"
			},
			{
				text: `Relevant reinforcer: ${controlAnalysis.initialConditions.relevantReinforcer || "Not specified"}`,
				style: "body"
			},
			{
				text: `Transition point: ${controlAnalysis.transitionPoint.changedCondition}`,
				style: "body"
			},
			{
				text: `Disturbing pattern: ${controlAnalysis.disturbingPattern}`,
				style: "body"
			},

			{
				text: "Starting Point",
				style: "section"
			},
			{
				text: initialization.startingInteraction.targetPattern,
				style: "body"
			},
			{
				text: `Begin under these conditions: ${initialization.startingInteraction.conditions.join(", ")}`,
				style: "body"
			},
			{
				text: `Ready to progress when: ${initialization.readinessCriterion}`,
				style: "body"
			},

			{
				text: "Program Phases",
				style: "section"
			},

			...phaseContent,

			{
				text: "Terminal Criterion",
				style: "section"
			},
			{
				text: transferPlan.terminalCriterion,
				style: "body"
			}
		],

		styles: {
			title: {
				fontSize: 22,
				bold: true,
				margin: [0, 0, 0, 20]
			},
			section: {
				fontSize: 15,
				bold: true,
				margin: [0, 18, 0, 8]
			},
			phaseTitle: {
				fontSize: 13,
				bold: true,
				margin: [0, 12, 0, 6]
			},
			approximationTitle: {
				fontSize: 11,
				bold: true,
				margin: [12, 8, 0, 4]
			},
			body: {
				fontSize: 10,
				lineHeight: 1.3,
				margin: [0, 0, 0, 5]
			},
			muted: {
				fontSize: 9,
				italics: true,
				color: "#475569",
				margin: [0, 0, 0, 6]
			}
		}
	};

	pdfMake.createPdf(docDefinition).download("constructional-affection-program.pdf");
};
