<script lang="ts">
	import type { ProgramInitialization } from '../../../../lambdas/src/domain';

	const { programInitialization }: { programInitialization: ProgramInitialization } = $props();
</script>

<div class="rounded-vintage border border-accent/40 bg-white p-5 text-primary shadow-soft">
	<p class="admin-eyebrow mb-3 text-primary/70">Your Starting Program</p>

	<h2 class="font-body text-xl font-bold">
		Start here: {programInitialization.startingPoint}
	</h2>

	<p class="mt-3 text-sm text-muted-dark">
		<span class="font-bold text-primary">Goal:</span>
		{programInitialization.terminalTargetPattern}
	</p>

	<div class="mt-6 space-y-4">
		{#each programInitialization.programStages as stage}
			<div class="rounded-vintage border border-border bg-background p-4">
				<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/60">
					Step {stage.index + 1}
				</p>

				<h3 class="mt-1 font-body text-lg font-bold text-primary">
					{stage.title}
				</h3>

				<p class="mt-2 text-sm text-muted-dark">
					<span class="font-bold text-primary">Entry:</span>
					{stage.entryCondition}
				</p>

				<p class="mt-2 text-sm text-muted-dark">
					<span class="font-bold text-primary">Target:</span>
					{stage.targetPattern}
				</p>

				<p class="mt-2 text-sm text-muted-dark">
					<span class="font-bold text-primary">Start when:</span>
					{stage.entryCondition}
				</p>

				<p class="mt-2 text-sm text-muted-dark">
					<span class="font-bold text-primary">Move on when:</span>
					{stage.successCriterion}
				</p>

				{#if stage.reinforcers?.length}
					<p class="mt-2 text-sm text-muted-dark">
						<span class="font-bold text-primary">Use:</span>
						{stage.reinforcers.join(', ')}
					</p>
				{/if}

				{#if stage.notes}
					<p class="mt-3 text-sm italic text-muted-dark">{stage.notes}</p>
				{/if}
			</div>
		{/each}
	</div>

	<p class="mt-6 border-t border-border pt-4 text-sm text-muted-dark">
		<span class="font-bold text-primary">Why this starting point:</span>
		{programInitialization.rationale}
	</p>
</div>
