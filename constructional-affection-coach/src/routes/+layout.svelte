<script lang="ts">
	import "../app.css";
	import { browser } from "$app/environment";
	import { configureAmplify } from "$lib/auth/amplify";
	import { auth } from "$lib/auth/auth.svelte";
	import { signOut } from "aws-amplify/auth";
	import { goto } from "$app/navigation";
	import User from "$lib/assets/icons/User.svelte";
	import { onMount } from "svelte";
	import { page } from "$app/state";

	const { children } = $props();

	let errorMessage = $state("");
	let isAccountMenuOpen = $state(false);
	let accountMenu: HTMLDivElement;

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isAccountMenuOpen && accountMenu && !accountMenu.contains(event.target as Node)) {
				isAccountMenuOpen = false;
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isAccountMenuOpen) {
				isAccountMenuOpen = false;
			}
		};

		document.addEventListener("click", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	});

	$effect(() => {
		if (!browser) return;

		configureAmplify();
		void auth.refresh();
	});

	const logout = async () => {
		if (auth.isLoading) return;

		try {
			await signOut();
			await auth.refresh();
			isAccountMenuOpen = false;
			await goto("/login");
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unable to sign out.";
		}
	};
</script>

<svelte:head>
	<title>Constructional Affection</title>

	<meta
		name="description"
		content="Build personalized Constructional Affection programs through a guided constructional interview."
	/>
	<meta name="author" content="Chase Owens" />

	<meta property="og:title" content="Constructional Affection" />
	<meta
		property="og:description"
		content="Build personalized Constructional Affection programs through a guided constructional interview."
	/>
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://coach.constructionalaffection.com/images/constructional-affection-og.jpg"
	/>

	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<section class="shell flex min-h-screen flex-col bg-primary px-4">
	<div class="mx-auto flex w-full max-w-7xl flex-1 flex-col">
		<header class="flex items-center justify-between px-6 py-7 lg:px-10">
			<a href="/" class="flex shrink-0 items-center gap-3 text-white hover:text-white">
				<img src="/images/logo.png" alt="Constructional Affection" class="h-12 w-12" />

				<span class="text-sm font-bold leading-tight tracking-[0.24em] uppercase">
					Constructional<br />
					Affection Coach
				</span>
			</a>

			<div class="flex items-center gap-3">
				{#if auth.isAuthenticated}
					<a
						href="/programs"
						class={[
							"text-sm font-semibold transition",
							page.url.pathname.startsWith("/programs")
								? "text-accent"
								: "text-white/80 hover:text-white"
						]}
					>
						Programs
					</a>
				{/if}
				<div bind:this={accountMenu} class="relative">
					<button
						type="button"
						aria-label="Open account menu"
						aria-expanded={isAccountMenuOpen}
						onclick={() => (isAccountMenuOpen = !isAccountMenuOpen)}
						class="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-primary"
					>
						<User class="size-5 cursor-pointer" />
					</button>

					{#if isAccountMenuOpen}
						<div
							class="absolute right-0 z-50 mt-1 w-fit rounded-vintage border border-border bg-white p-2 shadow-soft flex flex-col gap-3"
						>
							{#if auth.isAuthenticated}
								<p class="text-primary px-4">
									{auth.user?.signInDetails?.loginId ?? auth.user?.username}
								</p>

								<button
									type="button"
									onclick={logout}
									class="block w-full rounded-lg px-4 text-left text-sm font-semibold text-primary transition hover:bg-secondary-soft"
								>
									Sign out
								</button>
							{:else}
								<a
									href="/login"
									onclick={() => (isAccountMenuOpen = false)}
									class="block rounded-lg px-4 text-sm font-semibold text-primary transition hover:bg-secondary-soft hover:text-primary"
								>
									Log in
								</a>

								<a
									href="/signup"
									onclick={() => (isAccountMenuOpen = false)}
									class="block rounded-lg px-4 text-sm font-semibold text-primary transition hover:bg-secondary-soft hover:text-primary"
								>
									Sign up
								</a>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</header>

		{#if errorMessage}
			<p class="px-6 text-sm text-error lg:px-10">
				{errorMessage}
			</p>
		{/if}

		<main class="flex-1">
			{@render children()}
		</main>

		<footer
			class="mt-10 flex items-center justify-between border-t border-white/15 px-6 py-8 text-sm text-white/60 lg:px-10"
		>
			<p>Constructional Affection</p>

			<a
				href="https://constructionalaffection.com"
				target="_blank"
				rel="noreferrer"
				class="font-medium text-white/70 transition hover:text-accent"
			>
				constructionalaffection.com
			</a>
		</footer>
	</div>
</section>
