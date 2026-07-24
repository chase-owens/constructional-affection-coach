<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { browser } from "$app/environment";
	import { configureAmplify } from "$lib/auth/amplify";

	$effect(() => {
		if (browser) {
			configureAmplify();
		}
	});

	const { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
