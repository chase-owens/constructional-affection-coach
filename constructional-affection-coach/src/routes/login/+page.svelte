<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { interviewClient } from "$lib/api/interviewClient";
	import { auth } from "$lib/auth/auth.svelte";
	import { savedProgram } from "$lib/stores/interview-program";
	import { signIn } from "aws-amplify/auth";
	import { onMount } from "svelte";

	let email = $state("");
	let password = $state("");
	let errorMessage = $state("");
	let isSubmitting = $state(false);

	const login = async () => {
		errorMessage = "";
		isSubmitting = true;

		try {
			const result = await signIn({
				username: email.trim(),
				password
			});

			if (result.isSignedIn) {
				await auth.refresh();

				if (auth.user?.userId && $savedProgram?.interviewId) {
					await interviewClient.claim($savedProgram.interviewId);
					savedProgram.set(null);
				}

				await goto(resolve("/programs"));
			}

			if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
				await goto(resolve(`/confirm-signup?email=${encodeURIComponent(email.trim())}`));
				return;
			}

			errorMessage = `Additional sign-in step required: ${result.nextStep.signInStep}`;
		} catch (error) {
			console.error("SIGN IN ERROR:", error);

			if (error instanceof Error) {
				console.log("NAME:", error.name);
				console.log("MESSAGE:", error.message);
			}
		} finally {
			isSubmitting = false;
		}
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		void login();
	};

	onMount(async () => {
		await auth.refresh();

		if (auth.isAuthenticated) {
			await goto(resolve("/programs"));
		}
	});
</script>

<svelte:head>
	<title>Login | Constructional Affection Coach</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-6">
	<div class="w-full max-w-md rounded-vintage border border-border bg-white p-8 shadow-soft">
		<h1 class="text-3xl font-bold text-primary">Welcome Back</h1>

		{#if errorMessage}
			<p class="px-6 text-sm text-error lg:px-10">
				{errorMessage}
			</p>
		{/if}

		<p class="mt-2 text-muted-dark">Sign in to continue your Constructional Affection programs.</p>

		<form onsubmit={handleSubmit} class="mt-8 space-y-5">
			<div>
				<label for="email">Email</label>

				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					required
					autocomplete="email"
					class="input"
				/>
			</div>

			<div>
				<label for="password">Password</label>

				<input
					id="password"
					name="password"
					type="password"
					required
					bind:value={password}
					autocomplete="current-password"
					class="input"
				/>
			</div>

			<button type="submit" disabled={isSubmitting} class="button-base button-primary w-full">
				{isSubmitting ? "Signing in..." : "Login"}
			</button>

			<div class="text-center text-sm">
				Don't have an account?

				<a href={resolve("/signup")} class="font-semibold text-primary"> Create one </a>
			</div>
		</form>
	</div>
</div>
