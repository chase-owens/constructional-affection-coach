<script lang="ts">
	const steps = [
		{
			kicker: '01',
			title: 'Define Success',
			text: 'Describe what a successful interaction with your dog would look like.'
		},
		{
			kicker: '02',
			title: 'Discover What Already Works',
			text: 'Identify relevant skills, reinforcers, and conditions that can be used to begin.'
		},
		{
			kicker: '03',
			title: 'Analyze Existing Control',
			text: 'Determine where the target pattern already occurs and under what conditions.'
		},
		{
			kicker: '04',
			title: 'Build Your Starting Strategy',
			text: 'Receive a starting point based on the Constructional Affection methodology.'
		}
	];
</script>

<svelte:head>
	<title>Constructional Affection Coach</title>
	<meta
		name="description"
		content="A guided interview that helps determine where to begin a Constructional Affection program."
	/>
</svelte:head>

<main class="min-h-screen bg-background text-foreground">
	<section class="relative overflow-hidden bg-primary text-primary-foreground">
		<header class="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
			<a href="/" class="flex items-center gap-3 text-white hover:text-white">
				<img src="/images/logo.png" alt="Constructional Affection" class="h-12 w-12" />
				<span class="text-sm font-bold tracking-[0.25em] uppercase">
					Constructional<br />Affection
				</span>
			</a>

			<nav class="hidden items-center gap-8 text-sm font-medium text-white/85 md:flex">
				<a href="/interview" class="hover:text-accent">Start Interview</a>
				<a href="https://constructionalaffection.com" class="hover:text-accent">
					Existing Website
				</a>
			</nav>

			<a href="/interview" class="admin-button-primary hidden md:inline-flex">
				Start the Interview
			</a>
		</header>

		<div class="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-24 sm:pb-0 pt-10 lg:grid-cols-[1fr_0.95fr] lg:px-10 lg:pb-32">
			<div class="relative z-10 max-w-2xl">
				<p class="admin-eyebrow mb-5">Guided Constructional Interview</p>

				<h1 class="text-5xl leading-[1.05] font-bold text-white sm:text-6xl lg:text-7xl">
					Build the interaction you want with your dog.
				</h1>

				<p class="mt-6 max-w-xl text-lg leading-8 text-white/85">
					A guided interview that helps identify the outcome you want, the skills and
					reinforcers already available, and where to begin a Constructional Affection program.
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<a href="/interview" class="admin-button-primary inline-flex items-center justify-center px-6 py-4">
						Start the Interview <span class="ml-3">→</span>
					</a>

					<a
						href="https://constructionalaffection.com"
						class="admin-button-secondary inline-flex items-center justify-center px-6 py-4"
					>
						Learn the Method
					</a>
				</div>
			</div>

			<div class="relative min-h-136.5 sm:max-h-50 lg:min-h-190">
				<img
					src="/images/nanook_hero.png"
					alt="Calm dog lying down"
					class="absolute bottom-0 sm:bottom-30 lg:bottom-0 right-0 z-10  w-136 max-w-none drop-shadow-2xl lg:-right-16 lg:w-184"
				/>
			</div>
		</div>

		<div class="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent"></div>
	</section>

	<section class="relative z-20 mx-auto -mt-40 sm:-mt-40 max-w-6xl px-6 lg:px-10 lg:mt-0">
		<div class="rounded-vintage border border-border bg-white p-6 shadow-soft sm:p-8">
			<div class="flex flex-col gap-5 md:flex-row md:items-center">
				<div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-3xl text-accent">
					◎
				</div>

				<div>
					<h2 class="font-body text-xl font-bold text-primary">
						Constructional Affection is designed to help owners construct calm, patient
						interaction patterns using affection as reinforcement.
					</h2>
					<p class="mt-2 text-muted-dark">
						It is not a general-purpose dog training or behavior-treatment program.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-6 py-20 lg:px-10">
		<div class="text-center">
			<h2 class="text-4xl font-bold text-primary">How It Works</h2>
			<div class="mx-auto mt-4 h-1 w-20 rounded-full bg-accent"></div>
		</div>

		<div class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each steps as step}
				<article class="rounded-vintage border border-border bg-white p-6 text-center shadow-soft">
					<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-accent">
						{step.kicker}
					</div>

					<h3 class="mt-5 font-body text-xl font-bold text-primary">{step.title}</h3>
					<p class="mt-4 text-sm leading-7 text-muted-dark">{step.text}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
		<div class="rounded-vintage bg-primary p-10 text-center shadow-soft">
			<h2 class="mx-auto max-w-2xl text-4xl font-bold text-white">
				Ready to build a better interaction with your dog?
			</h2>

			<a href="/interview" class="admin-button-primary mt-8 inline-flex px-8 py-4">
				Start the Interview <span class="ml-3">→</span>
			</a>
		</div>
	</section>

	<footer class="border-t border-border bg-primary px-6 py-8 text-white lg:px-10">
		<div class="mx-auto flex max-w-7xl flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
			<p>© 2026 Constructional Affection</p>
			<a href="https://constructionalaffection.com" class="text-white/80 hover:text-accent">
				Existing Website
			</a>
		</div>
	</footer>
</main>