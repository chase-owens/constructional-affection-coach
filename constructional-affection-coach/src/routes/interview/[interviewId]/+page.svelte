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
	import { constructionalProgramMock } from "$lib/data/ConstructionalProgram.mock";

	const USE_COMPLETED_MOCK = import.meta.env.DEV;

	let interviewId = $derived(page.params.interviewId);

	let targetOutcome = $state<TargetOutcome | null>(null);
	let constructionalAssets = $state<ConstructionalAssets | null>(null);
	let constructionalProgram = $state<ConstructionalProgram | null>(null);
	let isCreatingProgram = $state(false);

	const phases = $derived(constructionalProgram?.transferPlan.phases);
	const startingPoint = $derived(constructionalProgram?.initialization.readinessCriterion);
	const terminalOutcome = $derived(constructionalProgram?.targetOutcome.desiredInteractionPattern);

	const restoreCompletedInterview = async () => {
		if (!interviewId) return;

		const savedInterview = await interviewClient.get(interviewId);

		if (!savedInterview.program) return;

		constructionalProgram = savedInterview.program;
		targetOutcome = savedInterview.program.targetOutcome;
		constructionalAssets = savedInterview.program.constructionalAssets;

		isCreatingProgram = false;
	};

	const loadCompletedMockInterview = () => {
		constructionalProgram = constructionalProgramMock;
	};

	// initialize interview state on load
	onMount(async () => {
		if (USE_COMPLETED_MOCK) {
			loadCompletedMockInterview();
			return;
		}

		try {
			restoreCompletedInterview();
		} catch (err) {
			console.error("Failed to initialize interview", err);
		} finally {
			isCreatingProgram = false;
		}
	});
</script>

<main class="relative rounded-vintage border-accent border-3 bg-white p-6 shadow-soft sm:p-10">
	<div class="mb-8 text-center">
		<p class="admin-eyebrow">Constructional Affection Program</p>
		<h1 class="mt-3 text-4xl font-bold text-primary max-w-xl m-auto">
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

				<p class="admin-eyebrow mt-6">Fetching your program</p>

				<h2 class="mt-3 text-2xl font-bold text-primary">Just a few more seconds...</h2>

				<p class="mt-3 text-sm leading-6 text-muted-dark">
					I’m using the goal, what already works, and the interaction chain to choose the first step
					and build the progression.
				</p>
			</div>
		{/if}

		{#if targetOutcome}<TargetOutcomeSummaryCard {targetOutcome} />{/if}
		{#if constructionalAssets}<ConstructionalAssetsCard {constructionalAssets} />{/if}
		{#if phases && startingPoint && terminalOutcome}<ProgramInitializationCard
				{phases}
				{startingPoint}
				{terminalOutcome}
			/>
		{/if}
	</div>
</main>
