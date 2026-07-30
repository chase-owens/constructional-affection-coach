<script lang="ts">
	import { resolve } from "$app/paths";
	import Search from "$lib/assets/icons/Search.svelte";
	import { auth } from "$lib/auth/auth.svelte";
</script>

<div
	class="mx-auto h-full rounded-vintage border border-accent/40 bg-secondary-soft p-8 text-center shadow-soft"
>
	<div
		class="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-border text-primary"
	>
		<Search class="size-8" />
	</div>

	<p class="eyebrow mt-6">Program not available</p>

	<h2 class="mt-3 text-2xl font-bold text-primary">
		We couldn't locate the program associated with this link
	</h2>

	{#if !auth.isAuthenticated}<p class="mt-3 text-sm leading-6 text-muted-dark">
			If you created it while signed in, sign in to access it from your saved programs.
		</p>
	{:else}
		<p class="mt-3 text-sm leading-6 text-muted-dark">
			If you created it while signed in, you can sign in to access it from your saved programs.
		</p>
	{/if}
	<p class="mt-3 text-sm leading-6 text-muted-dark">
		If not, your browser data may have been cleared or you're using a different device.
	</p>

	<div class="mt-8 flex flex-wrap justify-center gap-6 align-middle">
		{#if auth.isAuthenticated}<a class="button-base button-primary" href={resolve("/")}>
				View Programs
			</a>{/if}

		<a class="button-base button-primary" href={resolve("/interview")}> Start New Interview </a>
	</div>
</div>
