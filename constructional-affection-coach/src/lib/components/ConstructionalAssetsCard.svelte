<script lang="ts">
	import type { ConstructionalAssets } from '../../../../lambdas/src/domain';

	const { constructionalAssets }: { constructionalAssets: ConstructionalAssets } = $props();
</script>

<div class="mb-8 rounded-vintage border border-accent/40 bg-white p-5 text-primary shadow-soft">
	<p class="admin-eyebrow mb-3 text-primary/70">What We Can Build From</p>

	<div class="grid gap-4 md:grid-cols-2">
		<div>
			<h3 class="font-bold">Social interaction</h3>
			<ul class="mt-2 space-y-1 text-sm text-muted-dark">
				<li>Touch: {constructionalAssets.socialReinforcers.touch}</li>
				<li>Talk: {constructionalAssets.socialReinforcers.talk}</li>
				<li>Eye contact: {constructionalAssets.socialReinforcers.eyeContact}</li>
				<li>Closeness: {constructionalAssets.socialReinforcers.proximity}</li>
			</ul>
		</div>

		<div>
			<h3 class="font-bold">Relevant skills</h3>
			<ul class="mt-2 space-y-2 text-sm text-muted-dark">
				{#each constructionalAssets.relevantSkills as skill}
					<li>
						<span class="font-bold text-primary">{skill.name}</span>
						{#if skill.context}
							<span> — {skill.context}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	{#if constructionalAssets.conditionsWhereTargetPatternOccurs.length}
		<div class="mt-5 border-t border-border pt-4">
			<h3 class="font-bold">Where it already happens</h3>

			<ul class="mt-2 space-y-2 text-sm text-muted-dark">
				{#each constructionalAssets.conditionsWhereTargetPatternOccurs as condition}
					<li>
						<span class="font-bold text-primary">{condition.behaviorObserved}</span>
						<span> — {condition.description}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
