<script lang="ts">
	import { goto } from "$app/navigation";
	import { auth } from "$lib/auth/auth.svelte";
	import { signIn } from "aws-amplify/auth";
	import { onMount } from "svelte";

	let email = $state("");
	let password = $state("");
	let errorMessage = "";
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
				await goto("/programs");
			}

			if (result.nextStep.signInStep === "CONFIRM_SIGN_UP") {
				await goto(`/confirm-signup?email=${encodeURIComponent(email.trim())}`);
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
			await goto("/programs");
		}
	});
</script>

<svelte:head>
	<title>Login | Constructional Affection Coach</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-6">
	<div class="w-full max-w-md rounded-vintage bg-white shadow-soft border border-border p-8">
		<h1 class="text-3xl font-bold text-primary">Welcome Back</h1>

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
					class="admin-input"
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
					class="admin-input"
				/>
			</div>

			<button type="submit" disabled={isSubmitting} class="admin-button-primary w-full">
				{isSubmitting ? "Signing in..." : "Login"}
			</button>

			<div class="text-center text-sm">
				Don't have an account?

				<a href="/signup" class="text-primary font-semibold"> Create one </a>
			</div>
		</form>
	</div>
</div>
