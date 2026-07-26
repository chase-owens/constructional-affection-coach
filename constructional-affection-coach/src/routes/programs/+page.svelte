<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import type { SavedProgram } from "$lib/api/getInterviews";
	import { interviewClient } from "$lib/api/interviewClient";
	import { auth } from "$lib/auth/auth.svelte";

	let isLoading = $state(true);
	let errorMessage = $state("");
	let programs = $state<SavedProgram[]>([]);
	let hasLoaded = $state(false);

	const loadPrograms = async () => {
		if (hasLoaded) return;

		hasLoaded = true;
		isLoading = true;
		errorMessage = "";

		try {
			programs = await interviewClient.getAll();
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unable to load your programs.";
		} finally {
			isLoading = false;
		}
	};

	$effect(() => {
		if (auth.isLoading) return;

		if (!auth.user) {
			void goto(resolve("/login"));
			return;
		}

		void loadPrograms();
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

		<a href={resolve("/interview")} class="button-base button-primary"> Start New Interview </a>
	</div>

	{#if isLoading}
		<div
			class="mx-auto mt-8 max-w-2xl rounded-vintage border border-accent/40 bg-secondary-soft p-8 text-center shadow-soft"
		>
			<div
				class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent"
			></div>

			<p class="eyebrow mt-6">Loading Your Programs</p>

			<h2 class="mt-3 text-2xl font-bold text-primary">Just a few more seconds...</h2>
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

			<a href={resolve("/interview")} class="button-base button-primary">
				Start Your First Interview
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each programs as interview (interview.interviewId)}
				<a
					href={resolve(`/programs/${interview.interviewId}`)}
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
