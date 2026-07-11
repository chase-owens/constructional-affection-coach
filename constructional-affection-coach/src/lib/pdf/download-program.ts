import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import type {
	TargetOutcome,
	ConstructionalAssets,
	ProgramInitialization
} from '../../../../lambdas/src/domain';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

type Args = {
	targetOutcome: TargetOutcome;
	constructionalAssets: ConstructionalAssets;
	programInitialization: ProgramInitialization;
};

export const downloadProgramPdf = ({
	targetOutcome,
	constructionalAssets,
	programInitialization
}: Args) => {
	const stageContent: Content[] = programInitialization.programStages.flatMap(
		(stage): Content[] => [
			{ text: `Step ${stage.index + 1}: ${stage.title}`, style: 'stepTitle' },
			{ text: `Entry: ${stage.entryCondition}`, style: 'body' },
			{ text: `Target: ${stage.targetPattern}`, style: 'body' },
			{ text: `Move on when: ${stage.successCriterion}`, style: 'body' },
			{ text: `Use: ${stage.reinforcers.join(', ')}`, style: 'body' },
			...(stage.notes ? [{ text: stage.notes, style: 'muted' } satisfies Content] : []),
			{ text: ' ', margin: [0, 4, 0, 4] }
		]
	);

	const docDefinition: TDocumentDefinitions = {
		pageMargins: [48, 48, 48, 48],

		content: [
			{ text: 'Constructional Affection Program', style: 'title' },

			{ text: 'Goal', style: 'section' },
			{ text: targetOutcome.desiredInteractionPattern ?? '', style: 'body' },
			{
				text: `Context: ${targetOutcome.primaryContext ?? 'Not specified'}`,
				style: 'muted'
			},

			{ text: 'What We Can Build From', style: 'section' },
			{
				ul: constructionalAssets.relevantSkills.map((skill) => `${skill.name} — ${skill.context}`)
			},

			{ text: 'Starting Point', style: 'section' },
			{ text: programInitialization.startingPoint, style: 'body' },

			{ text: 'Program Steps', style: 'section' },

			...stageContent,

			{ text: 'Why This Starting Point', style: 'section' },
			{ text: programInitialization.rationale, style: 'body' }
		],

		styles: {
			title: { fontSize: 22, bold: true, margin: [0, 0, 0, 20] },
			section: { fontSize: 15, bold: true, margin: [0, 18, 0, 8] },
			stepTitle: { fontSize: 13, bold: true, margin: [0, 12, 0, 6] },
			body: { fontSize: 10, lineHeight: 1.3, margin: [0, 0, 0, 5] },
			muted: {
				fontSize: 9,
				italics: true,
				color: '#475569',
				margin: [0, 0, 0, 6]
			}
		}
	};

	pdfMake.createPdf(docDefinition).download('constructional-affection-program.pdf');
};
