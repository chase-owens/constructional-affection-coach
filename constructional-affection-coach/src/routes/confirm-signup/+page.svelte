<script lang="ts">
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";

	let email = $state("");
	let confirmationCode = $state("");

	let errorMessage = $state("");
	let successMessage = $state("");

	let isSubmitting = $state(false);
	let isResending = $state(false);

	onMount(() => {
		const emailParam = new URLSearchParams(window.location.search).get("email");

		if (emailParam) {
			email = emailParam;
		}
	});

	const confirmAccount = async () => {
		errorMessage = "";
		successMessage = "";
		isSubmitting = true;

		try {
			const { isSignUpComplete, nextStep } = await confirmSignUp({
				username: email.trim(),
				confirmationCode: confirmationCode.trim()
			});

			if (isSignUpComplete) {
				await goto("/login?confirmed=true");
				return;
			}

			errorMessage = `Additional confirmation step required: ${nextStep.signUpStep}`;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : "Unable to confirm your account.";
		} finally {
			isSubmitting = false;
		}
	};

	const resendCode = async () => {
		errorMessage = "";
		successMessage = "";

		if (!email.trim()) {
			errorMessage = "Enter your email address first.";
			return;
		}

		isResending = true;

		try {
			await resendSignUpCode({
				username: email.trim()
			});

			successMessage = "A new confirmation code was sent to your email.";
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : "Unable to resend the confirmation code.";
		} finally {
			isResending = false;
		}
	};

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		void confirmAccount();
	};
</script>

<svelte:head>
	<title>Confirm Account | Constructional Affection Coach</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-background p-6">
	<div class="w-full max-w-md rounded-vintage border border-border bg-white p-8 shadow-soft">
		<h1 class="text-3xl font-bold text-primary">Confirm Your Account</h1>

		<p class="mt-2 text-muted-dark">Enter the verification code sent to your email.</p>

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
				<label for="confirmation-code"> Confirmation Code </label>

				<input
					id="confirmation-code"
					name="confirmationCode"
					type="text"
					inputmode="numeric"
					bind:value={confirmationCode}
					autocomplete="one-time-code"
					required
					class="admin-input"
				/>
			</div>

			{#if errorMessage}
				<p role="alert" class="text-sm text-red-700">
					{errorMessage}
				</p>
			{/if}

			{#if successMessage}
				<p role="status" class="text-sm text-green-700">
					{successMessage}
				</p>
			{/if}

			<button type="submit" disabled={isSubmitting} class="admin-button-primary w-full">
				{isSubmitting ? "Confirming..." : "Confirm Account"}
			</button>

			<button
				type="button"
				disabled={isResending}
				onclick={() => void resendCode()}
				class="w-full text-sm font-semibold text-primary"
			>
				{isResending ? "Sending..." : "Resend Confirmation Code"}
			</button>

			<div class="text-center text-sm">
				<a href="/login" class="font-semibold text-primary"> Back to Login </a>
			</div>
		</form>
	</div>
</div>
