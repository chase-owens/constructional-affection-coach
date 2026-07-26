<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { auth } from "$lib/auth/auth.svelte";
	import { signUp } from "aws-amplify/auth";
	import { onMount } from "svelte";

	let username = $state("");
	let email = $state("");
	let password = $state("");
	let confirmPassword = $state("");

	let errorMessage = $state("");
	let isSubmitting = $state(false);

	onMount(async () => {
		await auth.refresh();

		if (auth.isAuthenticated) {
			await goto(resolve("/programs"));
		}
	});

	const signup = async () => {
		errorMessage = "";

		if (password !== confirmPassword) {
			errorMessage = "Passwords do not match.";
			return;
		}

		isSubmitting = true;

		try {
			const userAttributes: Record<string, string> = {
				email: email.trim()
			};

			if (username.trim()) {
				userAttributes.preferred_username = username.trim();
			}

			const { isSignUpComplete } = await signUp({
				username: email.trim(),
				password,
				options: {
					userAttributes
				}
			});

			if (!isSignUpComplete) {
				await goto(resolve(`/confirm-signup?email=${encodeURIComponent(email.trim())}`));
				return;
			}

			await goto(resolve("/login"));
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

<div class="flex min-h-screen items-center justify-center bg-background p-6">
	<div class="w-full max-w-md rounded-vintage border border-border bg-white p-8 shadow-soft">
		<h1 class="text-3xl font-bold text-primary">Create Account</h1>

		<p class="mt-2 text-muted-dark">
			Create an account to save your Constructional Affection programs.
		</p>

		<form onsubmit={handleSubmit} class="mt-8 space-y-5">
			<div>
				<label for="email" class="mb-2 block text-sm font-semibold text-primary">
					Email <span class="text-error">*</span>
				</label>

				<input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					autocomplete="email"
					required
					class="input"
				/>
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-semibold text-primary">
					Password <span class="text-error">*</span>
				</label>

				<input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					autocomplete="new-password"
					required
					class="input"
				/>

				<div class="mt-2 text-xs leading-5 text-muted">
					<p>Password must contain:</p>
					<ul class="mt-1 list-disc pl-5">
						<li>At least 8 characters</li>
						<li>At least one uppercase letter</li>
						<li>At least one lowercase letter</li>
						<li>At least one number</li>
						<li>At least one special character</li>
					</ul>
				</div>
			</div>

			<div>
				<label for="confirm-password" class="mb-2 block text-sm font-semibold text-primary">
					Confirm Password <span class="text-error">*</span>
				</label>

				<input
					id="confirm-password"
					name="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					autocomplete="new-password"
					required
					class="input"
				/>
			</div>

			{#if errorMessage}
				<p role="alert" class="text-sm text-error">
					{errorMessage}
				</p>
			{/if}

			<button type="submit" disabled={isSubmitting} class="button-base button-primary w-full">
				{isSubmitting ? "Creating Account..." : "Create Account"}
			</button>

			<div class="text-center text-sm">
				Already have an account?
				<a href={resolve("/login")} class="font-semibold text-primary">Log In</a>
			</div>
		</form>
	</div>
</div>
