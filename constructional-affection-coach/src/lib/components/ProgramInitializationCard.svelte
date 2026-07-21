<script lang="ts">
	import type { ProgramPhase } from "../../../../lambdas/src/domain";

	const {
		phases,
		startingPoint,
		terminalOutcome
	}: { phases: ProgramPhase[]; startingPoint: string; terminalOutcome: string } = $props();
</script>

<section
	class="rounded-vintage border border-accent/40 bg-white p-5 text-primary shadow-soft sm:p-7"
>
	<header>
		<p class="admin-eyebrow mb-3 text-primary/70">Your Starting Program</p>

		<h2 class="max-w-4xl font-body text-xl font-bold sm:text-2xl">
			Start here: {startingPoint}
		</h2>

		<div class="mt-5 rounded-vintage border border-accent/30 bg-accent/5 p-4">
			<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/60">Terminal outcome</p>

			<p class="mt-2 text-sm leading-relaxed text-muted-dark sm:text-base">
				{terminalOutcome}
			</p>
		</div>
	</header>

	<div class="mt-8 space-y-5">
		{#each phases as phase, phaseIndex (phase.id)}
			<details
				class="group overflow-hidden rounded-vintage border border-border bg-background"
				open={phaseIndex === 0}
			>
				<summary
					class="flex cursor-pointer list-none items-start justify-between gap-4 p-5 marker:hidden"
				>
					<div class="min-w-0">
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/60">
							Phase {phase.order + 1}
						</p>

						<h3 class="mt-1 font-body text-lg font-bold text-primary sm:text-xl">
							{phase.title}
						</h3>

						<p class="mt-2 text-sm leading-relaxed text-muted-dark">
							{phase.targetPattern}
						</p>
					</div>

					<span
						class="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-accent/50 text-lg font-bold text-primary transition-transform group-open:rotate-45"
						aria-hidden="true"
					>
						+
					</span>
				</summary>

				<div class="border-t border-border px-5 pb-5 pt-5">
					<div class="grid gap-4 lg:grid-cols-2">
						<div>
							<p class="text-xs font-bold uppercase tracking-[0.15em] text-primary/60">
								Begin under these conditions
							</p>

							<p class="mt-2 text-sm leading-relaxed text-muted-dark">
								{phase.entryCondition}
							</p>
						</div>

						<div>
							<p class="text-xs font-bold uppercase tracking-[0.15em] text-primary/60">
								Phase complete when
							</p>

							<p class="mt-2 text-sm leading-relaxed text-muted-dark">
								{phase.terminalCriterion}
							</p>
						</div>
					</div>

					{#if phase.reinforcers?.length}
						<div class="mt-5">
							<p class="text-xs font-bold uppercase tracking-[0.15em] text-primary/60">
								Use throughout this phase
							</p>

							<div class="mt-2 flex flex-wrap gap-2">
								{#each phase.reinforcers as reinforcer (reinforcer)}
									<span
										class="rounded-full border border-accent/30 bg-white px-3 py-1 text-xs font-semibold text-primary"
									>
										{reinforcer}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<div class="mt-7">
						<div class="mb-4 flex items-center justify-between gap-4">
							<div>
								<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/60">
									Approximation sequence
								</p>

								<p class="mt-1 text-sm text-muted-dark">
									Change one condition at a time while preserving the target pattern.
								</p>
							</div>

							<span class="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
								{phase.approximations.length}
								{phase.approximations.length === 1 ? " approximation" : " approximations"}
							</span>
						</div>

						{#if phase.approximations.length}
							<ol class="relative space-y-4">
								{#each phase.approximations as approximation, approximationIndex (approximation.id)}
									<li class="relative pl-11">
										{#if approximationIndex < phase.approximations.length - 1}
											<span
												class="absolute left-4.25 top-9 h-[calc(100%+1rem)] w-px bg-accent/40"
												aria-hidden="true"
											></span>
										{/if}

										<span
											class="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border-2 border-accent bg-white text-sm font-bold text-primary"
										>
											{approximationIndex + 1}
										</span>

										<article class="rounded-vintage border border-border bg-white p-4">
											<div
												class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
											>
												<h4 class="font-body text-base font-bold text-primary">
													{approximation.changeFromPrevious.adjustment}
												</h4>

												<span
													class="w-fit rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-primary"
												>
													{approximation.changeFromPrevious.dimension}
												</span>
											</div>

											{#if approximation.conditions?.length}
												<div class="mt-4">
													<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary/60">
														Start under
													</p>

													<ul
														class="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-dark"
													>
														{#each approximation.conditions as condition (condition)}
															<li>{condition}</li>
														{/each}
													</ul>
												</div>
											{/if}

											<div class="mt-4 grid gap-4 md:grid-cols-2">
												<div>
													<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary/60">
														Maintain
													</p>

													<p class="mt-1 text-sm leading-relaxed text-muted-dark">
														{approximation.targetPattern}
													</p>
												</div>

												<div>
													<p class="text-xs font-bold uppercase tracking-[0.12em] text-primary/60">
														Advance when
													</p>

													<p class="mt-1 text-sm leading-relaxed text-muted-dark">
														{approximation.controlCriterion.sufficientToAdvance}
													</p>
												</div>
											</div>

											{#if approximation.recovery.previousSuccessfulApproximationId}
												<p
													class="mt-3 rounded-vintage bg-primary/5 px-3 py-2 text-xs leading-relaxed text-muted-dark"
												>
													If the target pattern deteriorates, return to the previous successful
													approximation before trying this change again.
												</p>
											{/if}
										</article>
									</li>
								{/each}
							</ol>
						{:else}
							<p
								class="rounded-vintage border border-dashed border-border p-4 text-sm text-muted-dark"
							>
								No smaller approximations have been added to this phase yet.
							</p>
						{/if}
					</div>

					{#if phase.notes}
						<div class="mt-6 border-t border-border pt-4">
							<p class="text-xs font-bold uppercase tracking-[0.15em] text-primary/60">
								How to run this phase
							</p>

							<p class="mt-2 text-sm italic leading-relaxed text-muted-dark">
								{phase.notes}
							</p>
						</div>
					{/if}
				</div>
			</details>
		{/each}
	</div>
</section>
