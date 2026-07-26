<script lang="ts">
	const { onRestartInterview }: { onRestartInterview: () => void } = $props();
</script>

<div
	class="mx-auto max-w-2xl rounded-vintage border border-border bg-secondary-soft p-8 text-center"
>
	<h2 class="text-2xl font-bold text-primary">This goal is outside the scope of this interview.</h2>

	<p class="mt-4 leading-7 text-muted-dark">
		This interview is designed to help define a constructive relationship outcome.
	</p>

	<p class="mt-4 leading-7 text-muted-dark">
		Your response appears to be outside that scope, so the interview won't continue.
	</p>

	<p class="mt-4 leading-7 text-muted-dark">
		You can restart with a situation involving a relationship, interaction, or behavior you would
		like to improve.
	</p>

	<div class="mt-8">
		<button class="button-base button-primary" onclick={onRestartInterview}> Start Over </button>
	</div>
</div>
