<script lang="ts">
	import { goto } from "$app/navigation";
	import { signUp } from "aws-amplify/auth";

	let email = $state("");
	let password = $state("");
	let confirmPassword = $state("");

	let errorMessage = $state("");
	let isSubmitting = $state(false);

	const signup = async () => {
		errorMessage = "";

		if (password !== confirmPassword) {
			errorMessage = "Passwords do not match.";
			return;
		}

		isSubmitting = true;

		try {
			const { isSignUpComplete } = await signUp({
				username: email.trim(),
				password,
				options: {
					userAttributes: {
						email: email.trim()
					}
				}
			});

			if (!isSignUpComplete) {
				await goto(`/confirm-signup?email=${encodeURIComponent(email.trim())}`);

				return;
			}

			await goto("/login");
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unable to create your account.";
		} finally {
			isSubmitting = false;
		}
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		void signup();
	};
</script>

<svelte:head>
	<title>Create Account | Constructional Affection Coach</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-6">
	<div class="w-full max-w-md rounded-vintage border border-border bg-white p-8 shadow-soft">
		<h1 class="text-3xl font-bold text-primary">Create Account</h1>

		<p class="mt-2 text-muted-dark">
			Create an account to save your Constructional Affection programs.
		</p>

		<form onsubmit={handleSubmit} class="mt-8 space-y-5">
			<div>
				<label for="email">Email</label>

				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					autocomplete="email"
					required
					class="admin-input"
				/>
			</div>

			<div>
				<label for="password">Password</label>

				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					autocomplete="new-password"
					required
					class="admin-input"
				/>
			</div>

			<div>
				<label for="confirm-password"> Confirm Password </label>

				<input
					id="confirm-password"
					name="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					autocomplete="new-password"
					required
					class="admin-input"
				/>
			</div>

			{#if errorMessage}
				<p role="alert" class="text-sm text-red-700">
					{errorMessage}
				</p>
			{/if}

			<button type="submit" disabled={isSubmitting} class="admin-button-primary w-full">
				{isSubmitting ? "Creating Account..." : "Create Account"}
			</button>

			<div class="text-center text-sm">
				Already have an account?

				<a href="/login" class="font-semibold text-primary"> Log In </a>
			</div>
		</form>
	</div>
</div>
