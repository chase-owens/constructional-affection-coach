import type { ConstructionalProgram } from "@constructional-affection/domain";

import { downloadProgramPdf } from "$lib/pdf/download-program";

export const handleDownload = (constructionalProgram: ConstructionalProgram) => {
	if (!constructionalProgram) return;

	downloadProgramPdf({
		constructionalProgram
	});
};
