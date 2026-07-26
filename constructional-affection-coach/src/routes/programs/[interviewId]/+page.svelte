<script lang="ts">
	import { page } from "$app/state";
	import { interviewClient } from "$lib/api/interviewClient";
	import ConstructionalAssetsCard from "$lib/components/ConstructionalAssetsCard.svelte";
	import ProgramInitializationCard from "$lib/components/ProgramInitializationCard.svelte";
	import TargetOutcomeSummaryCard from "$lib/components/TargetOutcomeSummaryCard.svelte";
	import { onMount } from "svelte";
	import type {
		ConstructionalAssets,
		ConstructionalProgram,
		TargetOutcome
	} from "../../../../../lambdas/src/schemas";
	import { PUBLIC_MOCK_INTERVIEW_ID, PUBLIC_USE_COMPLETED_MOCK } from "$env/static/public";
	import Download from "$lib/assets/icons/Download.svelte";
	import { handleDownload } from "$lib/interview/downloadProgramPdf";

	let interviewId = $derived(
		PUBLIC_USE_COMPLETED_MOCK === "true" ? PUBLIC_MOCK_INTERVIEW_ID : page.params.interviewId
	);

	let targetOutcome = $state<TargetOutcome | null>(null);
	let constructionalAssets = $state<ConstructionalAssets | null>(null);
	let constructionalProgram = $state<ConstructionalProgram | null>(null);
	let isCreatingProgram = $state(false);

	const phases = $derived(constructionalProgram?.transferPlan.phases);
	const startingPoint = $derived(constructionalProgram?.initialization.readinessCriterion);
	const terminalOutcome = $derived(constructionalProgram?.targetOutcome.desiredInteractionPattern);

	const fetchSavedInterview = async () => {
		if (!interviewId) return;

		const savedInterview = await interviewClient.get(interviewId);

		if (!savedInterview.program) return;

		constructionalProgram = savedInterview.program;
		targetOutcome = savedInterview.program.targetOutcome;
		constructionalAssets = savedInterview.program.constructionalAssets;

		isCreatingProgram = false;
	};

	// initialize interview state on load
	onMount(async () => {
		try {
			fetchSavedInterview();
		} catch (err) {
			console.error("Failed to initialize interview", err);
		} finally {
			isCreatingProgram = false;
		}
	});
</script>

<main class="relative rounded-vintage border-3 border-accent bg-white p-6 shadow-soft sm:p-10">
	<div class="mb-8 text-center">
		<p class="eyebrow">Constructional Affection Program</p>
		<h1 class="m-auto mt-3 max-w-xl text-4xl font-bold text-primary">
			Let’s build the interaction you want.
		</h1>
	</div>

	<div class="space-y-5">
		{#if isCreatingProgram}
			<div
				class="mx-auto mt-8 max-w-2xl rounded-vintage border border-accent/40 bg-secondary-soft p-8 text-center shadow-soft"
			>
				<div
					class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent"
				></div>

				<p class="eyebrow mt-6">Fetching your program</p>

				<h2 class="mt-3 text-2xl font-bold text-primary">Just a few more seconds...</h2>

				<p class="mt-3 text-sm leading-6 text-muted-dark">
					I’m using the goal, what already works, and the interaction chain to choose the first step
					and build the progression.
				</p>
			</div>
		{/if}

		{#if constructionalProgram}<button
				class="absolute top-3 right-3 rounded-full border border-accent p-2 text-primary"
				onclick={() => handleDownload(constructionalProgram!)}
				><Download class="size-6 cursor-pointer" /></button
			>{/if}

		{#if targetOutcome}<TargetOutcomeSummaryCard {targetOutcome} />{/if}
		{#if constructionalAssets}<ConstructionalAssetsCard {constructionalAssets} />{/if}
		{#if phases && startingPoint && terminalOutcome}<ProgramInitializationCard
				{phases}
				{startingPoint}
			/>{/if}
	</div>
</main>
