<script lang="ts">
	const { onRestartInterview }: { onRestartInterview: () => void } = $props();
</script>

<div
	class="mx-auto max-w-2xl rounded-vintage border border-border bg-secondary-soft p-8 text-center"
>
	<h2 class="text-2xl font-bold text-primary">This goal is outside the scope of this interview.</h2>

	<p class="mt-4 text-muted-dark leading-7">
		This interview is designed to help define a constructive relationship outcome.
	</p>

	<p class="mt-4 text-muted-dark leading-7">
		Your response appears to be outside that scope, so the interview won't continue.
	</p>

	<p class="mt-4 text-muted-dark leading-7">
		You can restart with a situation involving a relationship, interaction, or behavior you would
		like to improve.
	</p>

	<div class="mt-8">
		<button class="admin-button-primary" onclick={onRestartInterview}> Start Over </button>
	</div>
</div>
