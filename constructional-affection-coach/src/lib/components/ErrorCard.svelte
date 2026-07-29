<script lang="ts">
	let { message, startNewInterview }: { message: string; startNewInterview: () => void } = $props();

	const returnHome = () => {
		window.location.href = "/";
	};
</script>

<section
	class="flex min-h-160 items-center justify-center rounded-vintage border-2 border-accent bg-white px-6 py-16 sm:px-10"
	aria-labelledby="interview-error-heading"
>
	<article
		class="w-full max-w-2xl rounded-vintage border border-blue-200 bg-white px-6 py-12 text-center shadow-xl sm:px-12"
	>
		<p class="text-xs font-bold tracking-[0.3em] text-red-600 uppercase">
			Something interrupted the interview
		</p>

		<h1
			id="interview-error-heading"
			class="mx-auto mt-5 max-w-xl font-serif text-4xl leading-tight font-bold text-primary sm:text-5xl"
		>
			We couldn’t continue building your program.
		</h1>

		<div class="mx-auto mt-7 h-px w-16 bg-accent"></div>

		<p class="mx-auto mt-7 max-w-lg text-lg leading-8 text-muted-dark">
			{message}
		</p>

		<p class="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted">
			Please try starting a new interview. If this continues to happen, let us know.
		</p>

		<div class="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
			<button
				type="button"
				class="button-base button-primary min-w-56 cursor-pointer"
				onclick={startNewInterview}
			>
				Start a New Interview
				<span aria-hidden="true">→</span>
			</button>

			<button
				type="button"
				class="button-base min-w-44 cursor-pointer border border-primary bg-white font-medium text-primary"
				onclick={returnHome}
			>
				Return Home
			</button>
		</div>
	</article>
</section>
