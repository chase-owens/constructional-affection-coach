<script lang="ts">
	import type { TargetOutcome } from '../../../../lambdas/src/domain';

	const { targetOutcome }: { targetOutcome: TargetOutcome } = $props();
</script>

<div class="mb-8 rounded-vintage border border-accent/40 bg-white p-5 text-primary shadow-soft">
	<p class="admin-eyebrow mb-2 text-primary/70">Goal We Defined</p>

	<h2 class="font-body text-xl font-bold">
		{targetOutcome.desiredInteractionPattern}
	</h2>

	{#if targetOutcome.primaryContext}
		<p class="mt-3 text-sm text-muted-dark">
			<span class="font-bold text-primary">Context:</span>
			{targetOutcome.primaryContext}
		</p>
	{/if}
</div>
