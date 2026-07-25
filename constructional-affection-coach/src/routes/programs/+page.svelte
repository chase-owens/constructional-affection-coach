<script lang="ts">
	import { onMount } from "svelte";

	let isLoading = $state(true);

	onMount(() => {
		isLoading = false;
	});
</script>

<svelte:head>
	<title>My Programs | Constructional Affection Coach</title>
</svelte:head>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">Loading...</div>
{:else}
	<div class="mx-auto flex min-h-screen max-w-5xl flex-col p-8">
		<div class="rounded-vintage border border-border bg-white p-8 shadow-soft">
			<h2 class="mb-3 text-xl font-semibold">No saved programs yet</h2>

			<p class="mb-8 text-muted-dark">
				When you save a Constructional Affection program, it will appear here.
			</p>

			<a href="/interview" class="admin-button-primary"> Start Interview </a>
		</div>
	</div>
{/if}
