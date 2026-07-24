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

<main class="relative rounded-vintage border-accent border-3 bg-white p-6 shadow-soft sm:p-10">
	<div class="mb-8 text-center">
		<img
			class="block m-auto max-h-60 -mb-12 -mt-8"
			src="/images/stars.png"
			alt="celebration stars"
		/>

		<p class="admin-eyebrow">Program Complete</p>
		<h1 class="mt-3 text-4xl font-bold text-primary max-w-xl m-auto">
			Your Constructional Program is Ready!
		</h1>

		<p class="text-sm text-primary mt-3">
			We've built a personalized program based on what you told us.
		</p>
		<p class="text-sm text-primary">Now choose how you'd like to save or continue.</p>
	</div>

	<div class="space-y-5">
		<section class="grid sm:grid-cols-3 gap-4 border-t border-border pt-8">
			<SaveToAccountCard />
			<DownloadPDFCard interview={constructionalProgram} />
			<ContinueToProgramCard {interviewId} />
		</section>
		<ProgramPersistenceDisclaimer />
	</div>
</main>
