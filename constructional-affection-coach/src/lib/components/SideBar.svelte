<script lang="ts">
	import { phaseOrder, phaseTitle } from "$lib/interview/constants";

	const {
		areButtonsDisabled,
		currentPhaseIndex,
		currentPhaseTitle,
		isInterviewComplete,
		onExitInterview,
		onGenerateMockProgram,
		onRestartInterview
	}: {
		areButtonsDisabled: boolean;
		currentPhaseIndex: number;
		currentPhaseTitle: string;
		isInterviewComplete: boolean;
		onExitInterview: () => void;
		onGenerateMockProgram: () => void;
		onRestartInterview: () => void;
	} = $props();

	const isDev = import.meta.env.DEV;
</script>

<aside class="rounded-vintage border border-border bg-white p-6 shadow-soft">
	<p class="eyebrow text-highlight">Step {currentPhaseIndex + 1} of 5</p>
	<h2 class="mt-2 font-body text-2xl font-bold text-primary">{currentPhaseTitle}</h2>

	<div class="mt-8 space-y-5">
		{#each phaseOrder as phaseItem, index (phaseItem)}
			<div class="flex items-center gap-4">
				<div
					class={[
						"flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
						index < currentPhaseIndex
							? "border-accent bg-accent text-primary"
							: index === currentPhaseIndex
								? "border-accent bg-primary text-accent"
								: "border-border bg-white text-muted"
					]}
				>
					{index < currentPhaseIndex ? "✓" : index + 1}
				</div>

				<p class={["font-bold", index === currentPhaseIndex ? "text-primary" : "text-muted"]}>
					{phaseTitle[phaseItem]}
				</p>
			</div>
		{/each}
	</div>

	<div class="mt-10 rounded-vintage border border-border bg-secondary-soft p-4">
		<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">What to expect</p>
		<p class="mt-3 text-sm leading-6 text-muted-dark">
			We’ll define the goal, identify what already works, map the chain, then build your starting
			program.
		</p>
	</div>
	<div class="flex flex-col justify-center gap-5">
		{#if isDev && !isInterviewComplete}
			<button
				class="button-base button-secondary mt-5"
				disabled={areButtonsDisabled}
				onclick={onGenerateMockProgram}
			>
				Generate mock program
			</button>
		{/if}
		{#if isInterviewComplete}
			<button
				class="button-base button-primary mt-5"
				disabled={areButtonsDisabled}
				onclick={onRestartInterview}
			>
				Restart Interview
			</button>
		{/if}
		<button
			class="button-base button-primary"
			disabled={areButtonsDisabled}
			onclick={onExitInterview}
		>
			Exit Interview
		</button>
	</div>
	<img src="/images/dog-sketch.png" alt="sketch of dog with heart" />
</aside>
