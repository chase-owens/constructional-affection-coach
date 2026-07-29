<script lang="ts">
	import Checkmark from "$lib/assets/icons/Checkmark.svelte";
	import CloudDownload from "$lib/assets/icons/CloudDownload.svelte";
	import { handleDownload } from "$lib/interview/downloadProgramPdf";

	import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

	let { interview }: { interview: ConstructionalProgram } = $props();
</script>

<article
	class="flex h-full flex-col justify-between rounded-vintage border border-blue-200 bg-blue-50 p-8"
>
	<div class="flex justify-center">
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl text-primary"
		>
			<CloudDownload class="size-12" />
		</div>
	</div>

	<div class="min-h-32">
		<h3 class="mt-2 text-center font-serif text-xl font-bold text-primary">Download PDF</h3>

		<p class="mt-4 flex-1 text-center text-muted-dark">
			Keep an offline copy for printing, sharing, or future reference.
		</p>
	</div>

	<ul class="mt-6 space-y-2 text-sm">
		<li class="flex gap-2 text-primary">
			<Checkmark class="size-4" /><span class="text-primary"> Print anytime</span>
		</li>
		<li class="flex gap-2 text-primary">
			<Checkmark class="size-4" /><span class="text-primary">Share with others</span>
		</li>
		<li class="flex gap-2 text-primary">
			<Checkmark class="size-4" /> <span class="text-primary">Keep forever</span>
		</li>
	</ul>

	<button
		class="button-base button-primary mt-8 w-full cursor-pointer bg-primary font-medium text-white sm:mb-24 lg:mb-20"
		onclick={() => handleDownload(interview)}
	>
		Download PDF
	</button>
</article>
