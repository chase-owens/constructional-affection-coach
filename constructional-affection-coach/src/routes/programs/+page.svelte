<script lang="ts">
	import { onMount } from "svelte";
	import { interviewClient } from "$lib/api/interviewClient";

	let isLoading = $state(true);
	let errorMessage = $state("");
	let programs = $state<any[]>([]);

	onMount(async () => {
		try {
			const result = await interviewClient.getAll();
			programs = result;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unable to load your programs.";
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Programs | Constructional Affection Coach</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl px-6 py-10">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-white">Programs</h1>

			<h2 class="mt-2 text-white">
				View and manage your completed Constructional Affection programs.
			</h2>
		</div>

		<a href="/interview" class="button-base button-primary"> Start New Interview </a>
	</div>

	{#if isLoading}
		<div class="rounded-vintage border border-border bg-white p-8 shadow-soft">
			<p class="text-muted">Loading programs...</p>
		</div>
	{:else if errorMessage}
		<div class="rounded-vintage border border-error/20 bg-error-background p-6">
			<p class="text-error">{errorMessage}</p>
		</div>
	{:else if programs.length === 0}
		<div class="rounded-vintage border border-border bg-white p-8 shadow-soft">
			<h2 class="mb-3 text-xl font-semibold">No saved programs yet</h2>

			<p class="mb-8 text-muted-dark">
				Complete an interview to create your first Constructional Affection program.
			</p>

			<a href="/interview" class="button-base button-primary"> Start Your First Interview </a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each programs as interview}
				<a
					href={`/programs/${interview.interviewId}`}
					class="block rounded-vintage border border-border bg-white p-6 shadow-soft transition hover:-translate-y-0.5"
				>
					<h2 class="text-lg font-semibold text-primary">
						{interview.program?.targetOutcome?.clarifiedOutcome ?? "Constructional Program"}
					</h2>

					<p class="mt-2 text-sm text-muted">
						Updated {new Date(interview.updatedAt).toLocaleDateString()}
					</p>
				</a>
			{/each}
		</div>
	{/if}
</div>
