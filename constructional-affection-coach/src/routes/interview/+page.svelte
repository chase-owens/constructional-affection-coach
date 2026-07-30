<script lang="ts">
	import type {
		InteractionChain,
		InterviewPhase,
		TargetOutcome
	} from "@constructional-affection/domain";
	import { type ConstructionalAssets } from "@constructional-affection/domain";
	import { onMount } from "svelte";

	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { interviewClient } from "$lib/api/interviewClient";
	import { auth } from "$lib/auth/auth.svelte";
	import ErrorCard from "$lib/components/ErrorCard.svelte";
	import MobileInterviewProgress from "$lib/components/MobileInterviewProgress.svelte";
	import OutOfScopeCard from "$lib/components/OutOfScopeCard.svelte";
	import SideBar from "$lib/components/SideBar.svelte";
	import mockInterview from "$lib/data/interviewMock-workout";
	import { startInteractionChainPhase, startTargetOutcomePhase } from "$lib/interview";
	import { phaseOrder, phaseTitle } from "$lib/interview/constants";
	import { startConstructionalAssetsPhase } from "$lib/interview/constructional-assets";
	import { getPhaseIndex } from "$lib/interview/getPhaseIndex";
	import { getTargetOutcomeAgreementMessage } from "$lib/interview/getTargetOutcomeAgreementMessage";
	import type { InterviewIdType, InterviewResponse, Message } from "$lib/interview/types";
	import { savedProgram } from "$lib/stores/interview-program";
	import ProgramReadyView from "$lib/views/ProgramReadyView.svelte";

	import type { ConstructionalProgram } from "../../../../lambdas/src/schemas";

	const getPhaseInitializer = (
		phase: Exclude<InterviewPhase, "revise_target_outcome">
	): Message => {
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
					content: startConstructionalAssetsPhase(targetOutcome!)
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

			default: {
				const exhaustiveCheck: never = phase;
				return exhaustiveCheck;
			}
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

		await advanceInterviewPhaseAndCreateProgram();
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
	let error = $state<string | null>("");

	let messages = $state<Message[]>([getPhaseInitializer("target_outcome")]);
	let interviewId = $state<InterviewIdType | null>(null);

	// new interview and rehydrate interview helpers
	const resetInterviewState = () => {
		savedProgram.set(null);

		error = null;
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
			interviewId: newInterviewId
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

	onMount(async () => {
		try {
			if (!auth.isAuthenticated && $savedProgram?.interviewId) {
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
		if (result.constructionalAssets) {
			isOutOfCaScope =
				result.constructionalAssets.socialReinforcers.approachesVoluntarily === "no" ||
				result.constructionalAssets.socialReinforcers.reinforcers.touch === "not_reinforcing" ||
				result.constructionalAssets.socialReinforcers.reinforcers.proximity === "not_reinforcing";

			constructionalAssets = result.constructionalAssets;
		}
		if (result.interactionChain) interactionChain = result.interactionChain;
		if (result.constructionalProgram) constructionalProgram = result.constructionalProgram;

		const nextPhase = phaseOrder[currentPhaseIndex + 1];
		if (!nextPhase || isOutOfCaScope) return;

		const previousMessage = messages.at(-1);

		phase = nextPhase;

		//TODO: implement revise target outcome phase
		if (nextPhase === "revise_target_outcome") {
			console.log("revising target outcome");
			return;
		}

		const initializer =
			nextPhase === "program_initialization" && targetOutcome
				? getTargetOutcomeAgreementMessage(targetOutcome)
				: getPhaseInitializer(nextPhase);

		messages = previousMessage ? [previousMessage, initializer] : [initializer];
	};

	// this advances and runs each interview phase
	const advanceInterviewPhaseAndCreateProgram = async () => {
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

			if (auth.isAuthenticated) {
				await interviewClient.claim(currentInterviewId);
			}

			constructionalProgram = completedInterview.program;
			phase = "complete";

			if (!auth.isAuthenticated) {
				savedProgram.set({
					interviewId: currentInterviewId,
					updatedAt: now
				});
			} else {
				goto(resolve(`/programs/${currentInterviewId}`));
			}
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

		await advanceInterviewPhaseAndCreateProgram();
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

		if (phase === "complete" || phase === "revise_target_outcome") {
			throw Error(`Unsupported phase in submit: ${phase}`);
		}

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
</script>

<div class="mx-auto max-w-7xl">
	{#if isInitializingInterview}
		<div class="flex justify-center"><span class="loader"></span></div>
	{/if}
	{#if isOutOfCaScope}
		<OutOfScopeCard onRestartInterview={handleRestartInterview} />
	{:else}
		<div class="grid gap-6 lg:grid-cols-[280px_1fr]">
			<div class="hidden lg:block">
				<SideBar
					{currentPhaseIndex}
					currentPhaseTitle={phaseTitle[phase]}
					isInterviewComplete={!!constructionalProgram}
					areButtonsDisabled={isProcessing || isInitializingInterview}
					onExitInterview={handleExitInterview}
					onGenerateMockProgram={generateMockProgram}
					onRestartInterview={handleRestartInterview}
				/>
			</div>

			<div class="lg:hidden">
				<MobileInterviewProgress currentStep={currentPhaseIndex + 1} title={phaseTitle[phase]} />
			</div>

			{#if error}
				<ErrorCard message={error} {startNewInterview} />
			{:else if constructionalProgram && interviewId}
				<ProgramReadyView {constructionalProgram} {interviewId} />
			{:else}
				<main
					class="relative rounded-vintage border-3 border-accent bg-white p-6 shadow-soft sm:p-10"
				>
					<div class="mb-8 text-center">
						{#if constructionalProgram}
							<img
								class="m-auto -mt-8 -mb-12 block max-h-60"
								src="/images/stars.png"
								alt="celebration stars"
							/>
						{/if}
						<p class="eyebrow">Guided Constructional Interview</p>
						<h1 class="m-auto mt-3 max-w-xl text-4xl font-bold text-primary">
							Let’s build the interaction you want.
						</h1>
					</div>

					<div class="space-y-5">
						{#if isCreatingProgram}
							<div
								class="mx-auto mt-8 max-w-2xl rounded-vintage border border-accent/40 bg-secondary-soft p-8 text-center shadow-soft"
							>
								<div
									class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-accent"
								></div>

								<p class="eyebrow mt-6">Building Your Program</p>

								<h2 class="mt-3 text-2xl font-bold text-primary">
									Turning the interview into a starting plan...
								</h2>

								<p class="mt-3 text-sm leading-6 text-muted-dark">
									I’m using the goal, what already works, and the interaction chain to choose the
									first step and build the progression.
								</p>
							</div>
						{/if}

						{#if !constructionalProgram || isCreatingProgram}{#each messages as message (message.content)}
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
							{/each}{/if}
					</div>

					{#if phase === "program_initialization" && !hasUserAgreement && targetOutcome}
						<div class="mt-8 flex justify-end gap-3">
							<button
								onclick={rejectTargetOutcome}
								disabled={isProcessing}
								class="button-base button-secondary"
							>
								No, revise the goal
							</button>

							<button
								onclick={confirmTargetOutcomeAndInitializeProgram}
								disabled={isProcessing}
								class="button-base button-primary"
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
									class="min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-foreground outline-none placeholder:text-muted disabled:opacity-60"
									placeholder={isProcessing ? "Thinking..." : "Type your answer here..."}
								></textarea>

								<button
									onclick={submit}
									disabled={isProcessing || isInitializingInterview}
									class="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 bg-accent font-bold text-primary shadow-soft transition hover:bg-white disabled:opacity-60"
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
				<button
					class="button-base button-primary lg:hidden"
					disabled={isProcessing || isInitializingInterview}
					onclick={handleExitInterview}
				>
					Exit Interview
				</button>
			{/if}
		</div>{/if}
</div>
