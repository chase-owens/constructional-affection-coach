<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import Checkmark from "$lib/assets/icons/Checkmark.svelte";
	import Eye from "$lib/assets/icons/Eye.svelte";

	const { interviewId }: { interviewId: string } = $props();

	const handleContinueToProgram = () => goto(resolve(`/programs/${interviewId}`));
</script>

<article
	class="flex h-full flex-col justify-between rounded-vintage border border-amber-200 bg-amber-50 p-8"
>
	<div class="flex justify-center">
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl text-accent"
		>
			<Eye class="size-12" />
		</div>
	</div>

	<div class="min-h-32">
		<h3 class="mt-2 text-center font-serif text-xl font-bold text-primary">View Program</h3>

		<p class="mt-4 flex-1 text-center text-muted-dark">
			Continue to your completed program and get started.
		</p>
	</div>

	<ul class="mt-6 space-y-2 text-sm">
		<li class="flex gap-2 text-accent">
			<Checkmark class="size-4" /><span class="text-primary"> Review every phase</span>
		</li>
		<li class="flex gap-2 text-accent">
			<Checkmark class="size-4" /><span class="text-primary">Read the progression</span>
		</li>
		<li class="flex gap-2 text-accent">
			<Checkmark class="size-4" /> <span class="text-primary">Start implementing</span>
		</li>
	</ul>

	<button
		class="button-base button-primary mt-8 w-full cursor-pointer"
		onclick={handleContinueToProgram}
	>
		View Program
	</button>
	<p class="text-center text-xs text-muted sm:h-20 lg:pt-4">
		The url that this link takes you to will continue to fetch the program created with or without a
		user account
	</p>
</article>
