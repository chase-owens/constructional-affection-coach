<script lang="ts">
	import { goto } from "$app/navigation";
	import { signIn } from "aws-amplify/auth";

	let email = $state("");
	let password = $state("");
	let errorMessage = "";
	let isSubmitting = $state(false);

	const login = async () => {
		errorMessage = "";
		isSubmitting = true;

		try {
			const { isSignedIn, nextStep } = await signIn({
				username: email.trim(),
				password
			});

			if (isSignedIn) {
				await goto("/programs");
				return;
			}

			if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
				await goto(`/confirm-signup?email=${encodeURIComponent(email.trim())}`);
				return;
			}

			errorMessage = `Additional sign-in step required: ${nextStep.signInStep}`;
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : "Unable to sign in. Please try again.";
		} finally {
			isSubmitting = false;
		}
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		void login();
	};
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
