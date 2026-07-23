import { downloadProgramPdf } from "$lib/pdf/download-program";
import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

export const handleDownload = (constructionalProgram: ConstructionalProgram) => {
	if (!constructionalProgram) return;

	downloadProgramPdf({
		constructionalProgram
	});
};
