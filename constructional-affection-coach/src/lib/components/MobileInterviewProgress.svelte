<script lang="ts">
	import { phaseOrder, phaseTitle } from "$lib/interview/constants";

	type Step = {
		label: string;
	};

	let {
		currentStep,
		title
	}: {
		currentStep: number;
		title: string;
	} = $props();

	let expanded = $state(false);

	const progress = $derived(Math.round((currentStep / phaseOrder.length) * 100));
</script>

<section class="rounded-2xl bg-white px-5 py-5 shadow-sm lg:hidden">
	<div class="flex items-start justify-between gap-4">
		<div>
			<p class="text-xs font-bold tracking-[0.25em] text-red-500 uppercase">
				Step {currentStep} of {phaseOrder.length}
			</p>

			<h2 class="mt-2 text-2xl font-bold text-primary">
				{title}
			</h2>
		</div>

		<div
			class="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800"
			aria-label={`${progress}% complete`}
		>
			{progress}%
		</div>
	</div>

	<div class="mt-6 flex items-center">
		{#each phaseOrder as step, index}
			{@const stepNumber = index + 1}
			{@const isCurrent = stepNumber === currentStep}
			{@const isComplete = stepNumber < currentStep}

			<div class="flex flex-1 items-center last:flex-none">
				<div
					class={[
						"flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
						isCurrent
							? "border-accent bg-primary text-yellow-300"
							: isComplete
								? "border-blue-900 bg-blue-900 text-white"
								: "border-slate-200 bg-white text-slate-500"
					]}
				>
					{stepNumber}
				</div>

				{#if stepNumber < phaseOrder.length}
					<div
						class={["h-px flex-1", stepNumber < currentStep ? "bg-primary" : "bg-slate-200"]}
					></div>
				{/if}
			</div>
		{/each}
	</div>

	<button
		type="button"
		class="mt-5 flex w-full items-center justify-center gap-2 text-sm font-bold text-primary"
		aria-expanded={expanded}
		onclick={() => (expanded = !expanded)}
	>
		{expanded ? "Hide steps" : "View all steps"}

		<span class={["transition-transform", expanded ? "rotate-180" : ""]}> ↓ </span>
	</button>

	{#if expanded}
		<div class="mt-5 border-t border-slate-200 pt-5">
			<ol class="space-y-4">
				{#each phaseOrder as step, index}
					{@const stepNumber = index + 1}
					{@const isCurrent = stepNumber === currentStep}
					{@const isComplete = stepNumber < currentStep}

					<li class="flex items-center gap-3">
						<div
							class={[
								"flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
								isCurrent
									? "border-accent bg-primary text-yellow-300"
									: isComplete
										? "border-primary bg-primary text-white"
										: "border-slate-200 text-slate-500"
							]}
						>
							{stepNumber}
						</div>

						<span class={["text-sm font-semibold", isCurrent ? "text-primary" : "text-slate-500"]}>
							{phaseTitle[step]}
						</span>
					</li>
				{/each}
			</ol>
		</div>
	{/if}
</section>
