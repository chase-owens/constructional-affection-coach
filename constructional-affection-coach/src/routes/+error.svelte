<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";

	const isNotFound = $derived(page.status === 404);

	const eyebrow = $derived(isNotFound ? "Page Not Found" : "Something Went Wrong");

	const heading = $derived(
		isNotFound ? "You’re barking up the wrong tree." : "We couldn’t load this page."
	);

	const description = $derived(
		isNotFound
			? "We couldn’t find the page you were looking for."
			: "An unexpected issue occurred while loading this page."
	);

	const supportingText = $derived(
		isNotFound
			? "The link may be outdated, or the page may have moved."
			: "Please return home and try again."
	);
</script>

<svelte:head>
	<title
		>{isNotFound ? "Page Not Found" : "Something Went Wrong"} | Constructional Affection Coach</title
	>

	<meta
		name="description"
		content={isNotFound
			? "The page you requested could not be found."
			: "An unexpected error occurred."}
	/>
</svelte:head>

<main
	class="relative mx-auto min-h-155 max-w-7xl overflow-hidden rounded-[18px] border border-accent bg-white shadow-lg sm:min-h-170 lg:min-h-140"
	aria-labelledby="error-heading"
>
	<section
		class="error-card relative overflow-hidden rounded-[18px] border border-accent shadow-lg lg:hidden"
		aria-labelledby="error-heading-mobile"
	>
		<div class="relative z-10 flex min-h-190 flex-col px-8 pt-10">
			<p class="text-xs font-bold tracking-[0.3em] text-red-600 uppercase">
				{eyebrow}
			</p>

			<h1
				id="error-heading-mobile"
				class="md:max-w-s mt-5 max-w-xs font-serif text-5xl leading-[1.05] font-bold text-primary sm:max-w-xs"
			>
				{heading}
			</h1>

			<div class="mt-7 h-1 w-16 rounded-full bg-accent"></div>

			<div class="md:max-w-s mt-8 max-w-xs space-y-3 text-lg leading-8 text-primary sm:max-w-xs">
				<p>{description}</p>

				<p class="text-muted-dark">
					{supportingText}
				</p>
			</div>

			<a
				href={resolve("/")}
				class="button-base button-primary mt-10 inline-flex w-fit items-center gap-4"
			>
				Go Home
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</section>

	<picture class="absolute -inset-4 hidden lg:block">
		<source media="(max-width: 767px)" srcset="/images/wrong-tree-mobile.png" />

		<img
			src="/images/wrong-tree-desktop.png"
			alt=""
			class="h-full w-full object-cover object-center md:object-center"
			aria-hidden="true"
		/>
	</picture>

	<div
		class="relative z-10 hidden min-h-155 items-start px-7 pt-10 pb-80 sm:min-h-170 sm:px-10 sm:pt-14 lg:flex lg:min-h-140 lg:items-center lg:px-16 lg:py-16"
	>
		<div class="max-w-xl">
			<p class="text-xs font-bold tracking-[0.3em] text-red-600 uppercase sm:text-sm">
				{eyebrow}
			</p>

			<h1
				id="error-heading"
				class="mt-5 max-w-lg font-serif text-4xl leading-[1.05] font-bold text-primary sm:text-5xl lg:text-6xl"
			>
				{heading}
			</h1>

			<div class="mt-7 h-1 w-16 rounded-full bg-accent"></div>

			<div class="mt-8 max-w-lg space-y-2 text-base leading-7 text-primary sm:text-lg">
				<p>{description}</p>
				<p class="text-muted-dark">{supportingText}</p>
			</div>

			<a
				href={resolve("/")}
				class="button-base button-primary mt-9 inline-flex min-w-48 items-center justify-center gap-4"
			>
				Go Home
				<span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</main>
