<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { getCurrentUser, signOut } from "aws-amplify/auth";
	import { resolve } from "path";

	let isLoading = $state(true);
	let userEmail = $state("");
	let errorMessage = $state("");

	onMount(async () => {
		try {
			const user = await getCurrentUser();

			userEmail = user.signInDetails?.loginId ?? user.username;
		} catch {
			await goto("/login");
			return;
		} finally {
			isLoading = false;
		}
	});

	const logout = async () => {
		try {
			await signOut();
			await goto("/login");
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unable to sign out.";
		}
	};
</script>

<svelte:head>
	<title>My Programs | Constructional Affection Coach</title>
</svelte:head>

{#if isLoading}
	<div class="flex min-h-screen items-center justify-center">Loading...</div>
{:else}
	<div class="mx-auto flex min-h-screen max-w-5xl flex-col p-8">
		<header class="mb-10 flex items-center justify-between">
			<a href={resolve("/")} class="flex items-center gap-3 text-primary hover:text-primary">
				<img src="/images/logo.png" alt="Constructional Affection" class="h-12 w-12" />
				<div class="text-sm font-bold text-black tracking-[0.25em] uppercase">
					Constructional<br />Affection
				</div>
			</a>
			<div>
				<p class="text-sm text-muted-dark">
					Signed in as {userEmail}
				</p>

				<h1 class="text-4xl font-bold text-primary">My Programs</h1>
			</div>

			<button type="button" class="admin-button-secondary" onclick={logout}> Log Out </button>
		</header>

		{#if errorMessage}
			<p class="mb-6 text-red-700">
				{errorMessage}
			</p>
		{/if}

		<div class="rounded-vintage border border-border bg-white p-8 shadow-soft">
			<h2 class="mb-3 text-xl font-semibold">No saved programs yet</h2>

			<p class="mb-8 text-muted-dark">
				When you save a Constructional Affection program, it will appear here.
			</p>

			<a href="/interview" class="admin-button-primary"> Start Interview </a>
		</div>
	</div>
{/if}
