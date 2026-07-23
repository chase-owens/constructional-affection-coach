<script lang="ts">
	import Download from "$lib/assets/icons/Download.svelte";
	import OutOfScopeCard from "$lib/components/OutOfScopeCard.svelte";
	import ProgramInitializationCard from "$lib/components/ProgramInitializationCard.svelte";
	import TargetOutcomeSummaryCard from "$lib/components/TargetOutcomeSummaryCard.svelte";
	import type {
		ConstructionalProgram,
		TargetOutcome,
		ConstructionalAssets,
		InteractionChain
	} from "../../../../lambdas/src/schemas";
	import { startInteractionChainPhase, startTargetOutcomePhase } from "$lib/interview";
	import { startConstructionalAssetsPhase } from "$lib/interview/constructional-assets";
	import { savedProgram } from "$lib/stores/interview-program";
	import mockInterview from "$lib/data/interviewMock-workout";
	import { goto } from "$app/navigation";
	import ConstructionalAssetsCard from "$lib/components/ConstructionalAssetsCard.svelte";
	import { onMount } from "svelte";
	import { interviewClient } from "$lib/api/interviewClient";
	import { resolve } from "$app/paths";
	import { getTargetOutcomeAgreementMessage } from "$lib/interview/getTargetOutcomeAgreementMessage";
	import type { InterviewIdType, InterviewResponse, Message } from "$lib/interview/types";
	import { phaseOrder, phaseTitle } from "$lib/interview/constants";
	import { getPhaseIndex } from "$lib/interview/getPhaseIndex";
	import { handleDownload } from "$lib/interview/downloadProgramPdf";
	import type { InterviewPhase } from "../../../../lambdas/src/domain";

	const getPhaseInitializer = (phase: InterviewPhase): Message => {
		switch (phase) {
			case "target_outcome":
				return {
					role: "coach",
					content: startTargetOutcomePhase()
				};

			case "interaction_chain":
				return {
					role: "coach",
					content: startInteractionChainPhase()
				};

			case "constructional_assets":
				return {
					role: "coach",
					content: startConstructionalAssetsPhase()
				};

			case "program_initialization":
				return {
					role: "coach",
					content: "Thanks, I have enough to build the starting plan."
				};

			case "complete":
				return {
					role: "coach",
					content: "Way to go"
				};
		}
	};

	const rejectTargetOutcome = () => {
		hasUserAgreement = false;
		interactionChain = null;
		constructionalAssets = null;
		targetOutcome = null;

		phase = "target_outcome";

		messages = [
			{
				role: "coach",
				content:
					"No problem. Let's redefine the goal. Assuming this process is successful, what would you want to see happening instead?"
			}
		];

		answer = "";
	};

	const confirmTargetOutcomeAndInitializeProgram = async () => {
		hasUserAgreement = true;

		messages = [
			...messages,
			{
				role: "user",
				content: "Yes, that is the interaction I want to work toward."
			},
			{
				role: "coach",
				content:
					"Great. I'll use that goal, what already works, and the interaction chain to build your starting program."
			}
		];

		await initializeProgram();
	};

	let phase = $state<InterviewPhase>("target_outcome");
	let currentPhaseIndex = $derived(getPhaseIndex(phase));
	let targetOutcome = $state<TargetOutcome | null>(null);
	let isOutOfCaScope = $state(false);
	let constructionalAssets = $state<ConstructionalAssets | null>(null);
	let interactionChain = $state<InteractionChain | null>(null);
	let hasUserAgreement = $state(false);
	let constructionalProgram = $state<ConstructionalProgram | null>(null);
	let answer = $state("");
	let isProcessing = $state(false);
	let isCreatingProgram = $state(false);
	let isInitializingInterview = $state(true);

	let messages = $state<Message[]>([getPhaseInitializer("target_outcome")]);
	let interviewId = $state<InterviewIdType | null>(null);

	// new interview and rehydrate interview helpers
	const resetInterviewState = () => {
		savedProgram.set(null);

		interviewId = null;
		constructionalProgram = null;
		phase = "target_outcome";
		isOutOfCaScope = false;
		targetOutcome = null;
		constructionalAssets = null;
		interactionChain = null;
		hasUserAgreement = false;
		answer = "";
		isProcessing = false;
		isCreatingProgram = false;
		messages = [getPhaseInitializer("target_outcome")];
	};

	const startNewInterview = async () => {
		resetInterviewState();

		const newInterviewId = crypto.randomUUID();

		await interviewClient.create({
			interviewId: newInterviewId,
			userId: null
		});

		interviewId = newInterviewId;
	};

	const handleRestartInterview = async () => {
		if (isInitializingInterview) return;

		isInitializingInterview = true;

		try {
			await startNewInterview();
		} catch (err) {
			console.error("Failed to create interview", err);
		} finally {
			isInitializingInterview = false;
		}
	};

	const restoreCompletedInterview = async (interviewId: InterviewIdType) => {
		const savedInterview = await interviewClient.get(interviewId);

		if (!savedInterview.program) {
			await startNewInterview();
			return;
		}

		constructionalProgram = savedInterview.program;
		targetOutcome = savedInterview.program.targetOutcome;
		constructionalAssets = savedInterview.program.constructionalAssets;
		hasUserAgreement = true;
		phase = "complete";

		isCreatingProgram = false;
	};

	// initialize interview state on load
	onMount(async () => {
		try {
			if ($savedProgram?.interviewId) {
				isCreatingProgram = true;
				restoreCompletedInterview($savedProgram.interviewId);
				return;
			}

			await startNewInterview();
		} catch (err) {
			console.error("Failed to initialize interview", err);
		} finally {
			isInitializingInterview = false;
		}
	});

	const goToNextPhase = async (result: InterviewResponse) => {
		if (result.outsideScope) isOutOfCaScope = result.outsideScope;
		if (result.targetOutcome) {
			targetOutcome = result.targetOutcome;
			isOutOfCaScope = result.targetOutcome.scope !== "within_constructional_affection";
		}
		if (result.constructionalAssets) constructionalAssets = result.constructionalAssets;
		if (result.interactionChain) interactionChain = result.interactionChain;
		if (result.constructionalProgram) constructionalProgram = result.constructionalProgram;

		const nextPhase = phaseOrder[currentPhaseIndex + 1];
		if (!nextPhase || isOutOfCaScope) return;

		const previousMessage = messages.at(-1);

		phase = nextPhase;

		const initializer =
			nextPhase === "program_initialization" && targetOutcome
				? getTargetOutcomeAgreementMessage(targetOutcome)
				: getPhaseInitializer(nextPhase);

		messages = previousMessage ? [previousMessage, initializer] : [initializer];
	};

	const initializeProgram = async () => {
		const currentInterviewId = interviewId;
		const now = new Date().toISOString();

		if (!currentInterviewId) {
			throw new Error("Interview has not been initialized.");
		}

		isProcessing = true;
		isCreatingProgram = true;
		messages = [];

		try {
			await interviewClient.submitPhase(currentInterviewId, {
				phase: "program_initialization",
				targetOutcome,
				constructionalAssets,
				interactionChain
			});

			const completedInterview = await interviewClient.pollComplete(currentInterviewId);

			constructionalProgram = completedInterview.program;

			savedProgram.set({
				interviewId: currentInterviewId,
				updatedAt: now
			});

			phase = "complete";
		} catch (err) {
			console.error("Program initialization failed", err);
		} finally {
			isProcessing = false;
			isCreatingProgram = false;
		}
	};

	const generateMockProgram = async () => {
		if (isProcessing || isCreatingProgram || isInitializingInterview) return;

		targetOutcome = mockInterview.targetOutcome;
		constructionalAssets = mockInterview.constructionalAssets;
		interactionChain = mockInterview.interactionChain;

		phase = "program_initialization";
		hasUserAgreement = true;

		await initializeProgram();
	};

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();

			if (!isProcessing && answer.trim()) {
				await submit();
			}
		}
	};

	const submit = async () => {
		const trimmed = answer.trim();

		if (!trimmed || isProcessing || isInitializingInterview) {
			return;
		}

		const currentInterviewId = interviewId;

		if (!currentInterviewId) {
			console.error("Interview has not been initialized.");
			return;
		}

		isProcessing = true;
		answer = "";

		const nextMessages = [...messages, { role: "user" as const, content: trimmed }];

		messages = nextMessages;

		try {
			const result = await interviewClient.submitPhase(currentInterviewId, {
				phase,
				messages: nextMessages,
				targetOutcome,
				constructionalAssets,
				interactionChain
			});

			if (result.coachMessage) {
				messages = [
					...nextMessages,
					{
						role: "coach",
						content: result.coachMessage
					}
				];
			}

			if (result.phaseComplete) {
				await goToNextPhase(result);
			}
		} catch (err) {
			console.error("Interview phase submission failed", err);
		} finally {
			isProcessing = false;
		}
	};

	const handleExitInterview = () => {
		savedProgram.set(null);

		goto(resolve("/"));
	};

	const phases = $derived(constructionalProgram?.transferPlan.phases);
	const startingPoint = $derived(constructionalProgram?.initialization.readinessCriterion);
	const terminalOutcome = $derived(constructionalProgram?.targetOutcome.desiredInteractionPattern);
</script>

<section class="admin-shell min-h-screen px-4 py-8 bg-primary">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8 flex items-center justify-between">
			<a href={resolve("/")} class="flex items-center gap-3 text-primary hover:text-primary">
				<img src="/images/logo.png" alt="Constructional Affection" class="h-12 w-12" />
				<div class="text-sm font-bold text-black tracking-[0.25em] uppercase">
					Constructional<br />Affection
				</div>
			</a>

			<button onclick={handleExitInterview} class="admin-button-primary hover:bg-white">
				Exit Interview
			</button>
		</header>

		{#if isOutOfCaScope}
			<OutOfScopeCard onRestartInterview={handleRestartInterview} />
		{:else}
			<div class="grid gap-6 lg:grid-cols-[280px_1fr]">
				<aside class="rounded-vintage border border-border bg-white p-6 shadow-soft">
					<p class="admin-eyebrow text-highlight">Step {currentPhaseIndex + 1} of 5</p>
					<h2 class="mt-2 font-body text-2xl font-bold text-primary">{phaseTitle[phase]}</h2>

					<div class="mt-8 space-y-5">
						{#each phaseOrder as phaseItem, index (phaseItem)}
							<div class="flex items-center gap-4">
								<div
									class={[
										"flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
										index < currentPhaseIndex
											? "border-accent bg-accent text-primary"
											: index === currentPhaseIndex
												? "border-accent bg-primary text-accent"
												: "border-border bg-white text-muted"
									]}
								>
									{index < currentPhaseIndex ? "✓" : index + 1}
								</div>

								<p
									class={["font-bold", index === currentPhaseIndex ? "text-primary" : "text-muted"]}
								>
									{phaseTitle[phaseItem]}
								</p>
							</div>
						{/each}
					</div>

					<div class="mt-10 rounded-vintage border border-border bg-secondary-soft p-4">
						<p class="text-xs font-bold uppercase tracking-[0.18em] text-primary/70">
							What to expect
						</p>
						<p class="mt-3 text-sm leading-6 text-muted-dark">
							We’ll define the goal, identify what already works, map the chain, then build your
							starting program.
						</p>
					</div>

					{#if import.meta.env.DEV && !constructionalProgram}
						<button
							type="button"
							class="admin-button-secondary mt-5"
							onclick={generateMockProgram}
							disabled={isProcessing || isInitializingInterview}
						>
							Generate mock program
						</button>
					{/if}
					{#if constructionalProgram}
						<button
							type="button"
							class="admin-button-primary mt-5"
							onclick={handleRestartInterview}
							disabled={isProcessing || isInitializingInterview}
						>
							Restart Interview
						</button>
					{/if}
				</aside>

				<main
					class="relative rounded-vintage border-accent border-3 bg-white p-6 shadow-soft sm:p-10"
				>
					<div class="mb-8 text-center">
						<p class="admin-eyebrow">Guided Constructional Interview</p>
						<h1 class="mt-3 text-4xl font-bold text-primary">
							Let’s build the interaction you want.
						</h1>
					</div>

					{#if constructionalProgram}<button
							class="absolute top-3 right-3 text-primary rounded-full border border-accent p-2"
							onclick={() => handleDownload(constructionalProgram!)}
							><Download class="size-6 cursor-pointer" /></button
						>{/if}

					<div class="space-y-5">
						{#if hasUserAgreement && targetOutcome}
							<TargetOutcomeSummaryCard {targetOutcome} />
						{/if}

						{#if hasUserAgreement && constructionalAssets}
							<ConstructionalAssetsCard {constructionalAssets} />
						{/if}

						{#if hasUserAgreement && startingPoint && terminalOutcome && phases}
							<ProgramInitializationCard {phases} {startingPoint} {terminalOutcome} />
						{/if}

						{#if isCreatingProgram}
							<div
								class="mx-auto mt-8 max-w-2xl rounded-vintage border border-accent/40 bg-secondary-soft p-8 text-center shadow-soft"
							>
								<div
									class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent"
								></div>

								<p class="admin-eyebrow mt-6">Building Your Program</p>

								<h2 class="mt-3 text-2xl font-bold text-primary">
									Turning the interview into a starting plan...
								</h2>

								<p class="mt-3 text-sm leading-6 text-muted-dark">
									I’m using the goal, what already works, and the interaction chain to choose the
									first step and build the progression.
								</p>
							</div>
						{/if}

						{#each messages as message (message.content)}
							<div
								class={["flex gap-3", message.role === "user" ? "justify-end" : "justify-start"]}
							>
								{#if message.role === "coach"}
									<div
										class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary-soft text-primary"
									>
										🐾
									</div>
								{/if}

								<div
									class={[
										"max-w-[78%] rounded-vintage border p-4 leading-7",
										message.role === "coach"
											? "border-border bg-secondary-soft text-foreground"
											: "border-accent/50 bg-primary text-white"
									]}
								>
									<p class="text-sm font-semibold">{message.content}</p>
								</div>
							</div>
						{/each}
					</div>

					{#if phase === "program_initialization" && !hasUserAgreement && targetOutcome}
						<div class="mt-8 flex justify-end gap-3">
							<button
								onclick={rejectTargetOutcome}
								disabled={isProcessing}
								class="admin-button-secondary"
							>
								No, revise the goal
							</button>

							<button
								onclick={confirmTargetOutcomeAndInitializeProgram}
								disabled={isProcessing}
								class="admin-button-primary"
							>
								Yes, build my program
							</button>
						</div>
					{:else if !hasUserAgreement}
						<div class="mt-8 rounded-vintage border border-border bg-background p-2 shadow-soft">
							<div class="flex items-end gap-3">
								<textarea
									bind:value={answer}
									onkeydown={handleKeyDown}
									disabled={isProcessing || isInitializingInterview}
									rows="1"
									class="min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-foreground placeholder:text-muted outline-none disabled:opacity-60"
									placeholder={isProcessing ? "Thinking..." : "Type your answer here..."}
								></textarea>

								<button
									onclick={submit}
									disabled={isProcessing || isInitializingInterview}
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-accent font-bold text-primary shadow-soft transition hover:bg-white disabled:opacity-60 cursor-pointer"
									aria-label="Continue"
								>
									{isProcessing ? "…" : "➤"}
								</button>
							</div>
						</div>

						<p class="mt-4 text-center text-xs text-muted">
							Your answers are only used to build your program.
						</p>
					{/if}
				</main>
			</div>{/if}
	</div>
</section>
