<script lang="ts">
	import Checkmark from "$lib/assets/icons/Checkmark.svelte";
	import CloudDownload from "$lib/assets/icons/CloudDownload.svelte";
	import { handleDownload } from "$lib/interview/downloadProgramPdf";
	import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

	let { interview }: { interview: ConstructionalProgram } = $props();
</script>

<article
	class="rounded-vintage border border-blue-200 bg-blue-50 p-8 h-full flex flex-col justify-between"
>
	<div class="flex justify-center">
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl text-primary"
		>
			<CloudDownload class="size-12" />
		</div>
	</div>

	<div class="h-32">
		<h3 class="mt-2 text-xl font-serif text-primary text-center font-bold">Download PDF</h3>

		<p class="mt-4 flex-1 text-muted-dark text-center">
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
		class="admin-button-primary bg-primary text-white mt-8 w-full font-medium cursor-pointer"
		onclick={() => handleDownload(interview)}
	>
		Download PDF
	</button>
	<span class="mt-7"></span>
</article>
