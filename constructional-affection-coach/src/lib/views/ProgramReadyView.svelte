<script lang="ts">
	import ContinueToProgramCard from "$lib/components/ContinueToProgramCard.svelte";
	import DownloadPDFCard from "$lib/components/DownloadPDFCard.svelte";
	import ProgramPersistenceDisclaimer from "$lib/components/ProgramPersistenceDisclaimer.svelte";
	import SaveToAccountCard from "$lib/components/SaveToAccountCard.svelte";
	import type { InterviewIdType } from "$lib/interview/types";

	import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

	let {
		constructionalProgram,
		interviewId
	}: { constructionalProgram: ConstructionalProgram; interviewId: InterviewIdType } = $props();
</script>

<main class="relative rounded-vintage border-3 border-accent bg-white p-6 shadow-soft sm:p-10">
	<div class="mb-8 text-center">
		<img
			class="m-auto -mt-8 -mb-12 block max-h-60"
			src="/images/stars.png"
			alt="celebration stars"
		/>

		<p class="eyebrow">Program Complete</p>
		<h1 class="m-auto mt-3 max-w-xl text-4xl font-bold text-primary">
			Your Constructional Program is Ready!
		</h1>

		<p class="mt-3 text-sm text-primary">
			We've built a personalized program based on what you told us.
		</p>
		<p class="text-sm text-primary">Now choose how you'd like to save or continue.</p>
	</div>

	<div class="space-y-5">
		<section class="grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
			<SaveToAccountCard />
			<DownloadPDFCard interview={constructionalProgram} />
			<ContinueToProgramCard {interviewId} />
		</section>
		<ProgramPersistenceDisclaimer />
	</div>
</main>
