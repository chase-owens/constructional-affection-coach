<script lang="ts">
	import Download from '$lib/assets/icons/Download.svelte';
	import ProgramInitializationCard from '$lib/components/ProgramInitializationCard.svelte';
	import TargetOutcomeSummaryCard from '$lib/components/TargetOutcomeSummaryCard.svelte';
	import type {
		TargetOutcome,
		InterviewPhase,
		ConstructionalAssets,
		InteractionChain,
		ProgramInitialization
	} from '$lib/domain';
	import { startTargetOutcomePhase } from '$lib/interview';
	import { startInteractionChainPhase } from '$lib/interview/interaction-change-phase';
	import html2canvas from 'html2canvas';
	import jsPDF from 'jspdf';

	let programCardEl: HTMLDivElement;

	const downloadProgramPdf = async () => {
		if (!programCardEl) return;

		const canvas = await html2canvas(programCardEl, {
			scale: 2,
			backgroundColor: '#ffffff'
		});

		const imgData = canvas.toDataURL('image/png');

		const pdf = new jsPDF('p', 'mm', 'a4');
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		const imgWidth = pageWidth;
		const imgHeight = (canvas.height * imgWidth) / canvas.width;

		let heightLeft = imgHeight;
		let position = 0;

		pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;

		while (heightLeft > 0) {
			position -= pageHeight;
			pdf.addPage();
			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}

		pdf.save('constructional-affection-program.pdf');
	};

	type InterviewResponse = {
		coachMessage?: string;
		phaseComplete: boolean;
		targetOutcome?: TargetOutcome;
		constructionalAssets: ConstructionalAssets;
		interactionChain: InteractionChain;
		programInitialization: ProgramInitialization;
		error?: string;
	};

	type Message = {
		role: 'coach' | 'user';
		content: string;
	};

	const phaseOrder: InterviewPhase[] = [
		'target_outcome',
		'constructional_assets',
		'interaction_chain',
		'program_initialization',
		'complete'
	];

	const phaseInitializers: Record<InterviewPhase, Message> = {
		target_outcome: {
			role: 'coach',
			content: startTargetOutcomePhase()
		},
		constructional_assets: {
			role: 'coach',
			content:
				'Does you dog do that in any other contexts? Can you bring it under control or predict it?'
		},
		interaction_chain: {
			role: 'coach',
			content: startInteractionChainPhase()
		},
		program_initialization: {
			role: 'coach',
			content: 'Thanks, I have enough to build the starting plan. '
		},
		complete: { role: 'coach', content: 'Way to go' }
	};

	const phaseTitle: Record<InterviewPhase, string> = {
		target_outcome: 'Define Success',
		constructional_assets: 'What Already Works',
		interaction_chain: 'Analyze Chain',
		program_initialization: 'Build Strategy',
		complete: 'Complete'
	};

	const rejectTargetOutcome = () => {
		hasUserAgreement = false;
		programInitialization = null;
		interactionChain = null;
		constructionalAssets = null;
		targetOutcome = null;

		phase = 'target_outcome';

		messages = [
			{
				role: 'coach',
				content:
					"No problem. Let's redefine the goal. Assuming this process is successful, what would you want to see happening instead?"
			}
		];

		answer = '';
	};

	const getTargetOutcomeAgreementMessage = (targetOutcome: TargetOutcome) => ({
		role: 'coach' as const,
		content: `Before I build your starting program, I want to make sure this is the interaction you want to work toward:

Context: ${targetOutcome.primaryContext}

Goal: ${targetOutcome.desiredInteractionPattern}

Does that look right?`
	});

	const confirmTargetOutcomeAndInitializeProgram = async () => {
		hasUserAgreement = true;

		messages = [
			...messages,
			{
				role: 'user',
				content: 'Yes, that is the interaction I want to work toward.'
			},
			{
				role: 'coach',
				content:
					'Great. I’ll use that goal, what already works, and the interaction chain to build your starting program.'
			}
		];

		await initializeProgram();
	};

	const getPhaseIndex = (phase: InterviewPhase) =>
		phaseOrder.findIndex((phaseItem) => phaseItem === phase);

	let phase = $state<InterviewPhase>('target_outcome');
	let currentPhaseIndex = $derived(getPhaseIndex(phase));
	let targetOutcome = $state<TargetOutcome | null>(null);
	let constructionalAssets = $state<ConstructionalAssets | null>(null);
	let interactionChain = $state<InteractionChain | null>(null);
	let hasUserAgreement = $state(false);
	let programInitialization = $state<ProgramInitialization | null>(null);
	let answer = $state('');
	let isProcessing = $state(false);

	let messages = $state<Message[]>([phaseInitializers['target_outcome']]);

	const callInterviewApi = async (body: unknown) => {
		const response = await fetch('/api/interview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		const result = (await response.json()) as InterviewResponse;

		if (!response.ok) {
			console.error(result);
			return null;
		}

		return result;
	};

	const goToNextPhase = async (result: InterviewResponse) => {
		if (result.targetOutcome) targetOutcome = result.targetOutcome;
		if (result.constructionalAssets) constructionalAssets = result.constructionalAssets;
		if (result.interactionChain) interactionChain = result.interactionChain;
		if (result.programInitialization) programInitialization = result.programInitialization;

		const nextPhase = phaseOrder[currentPhaseIndex + 1];
		if (!nextPhase) return;

		const previousMessage = messages[messages.length - 1];

		phase = nextPhase;

		if (nextPhase === 'program_initialization' && targetOutcome) {
			messages = [previousMessage, getTargetOutcomeAgreementMessage(targetOutcome)];
		} else {
			messages = [previousMessage, phaseInitializers[nextPhase]];
		}
	};

	const initializeProgram = async () => {
		messages = [];
		isProcessing = true;

		try {
			const result = await callInterviewApi({
				phase: 'program_initialization',
				targetOutcome,
				constructionalAssets,
				interactionChain
			});

			if (!result) return;

			await goToNextPhase(result);
		} finally {
			isProcessing = false;
		}
	};

	const submit = async () => {
		const trimmed = answer.trim();
		if (!trimmed || isProcessing) return;

		isProcessing = true;
		answer = '';

		const nextMessages = [...messages, { role: 'user' as const, content: trimmed }];
		messages = nextMessages;

		try {
			const result = await callInterviewApi({
				phase,
				messages: nextMessages,
				targetOutcome,
				constructionalAssets,
				interactionChain
			});

			if (!result) return;

			if (result.coachMessage) {
				messages = [...nextMessages, { role: 'coach', content: result.coachMessage }];
			}

			if (result.phaseComplete) {
				await goToNextPhase(result);
				return;
			}
		} finally {
			isProcessing = false;
		}
	};
</script>

<section class="admin-shell min-h-screen px-4 py-8 bg-primary">
	<div class="mx-auto max-w-7xl">
		<header class="mb-8 flex items-center justify-between">
			<a href="/" class="flex items-center gap-3 text-primary hover:text-primary">
				<img src="/images/logo.png" alt="Constructional Affection" class="h-12 w-12" />
				<div class="text-sm font-bold text-black tracking-[0.25em] uppercase">
					Constructional<br />Affection
				</div>
			</a>

			<a href="/" class="admin-button-primary hover:bg-white"> Exit Interview </a>
		</header>

		<div class="grid gap-6 lg:grid-cols-[280px_1fr]">
			<aside class="rounded-vintage border border-border bg-white p-6 shadow-soft">
				<p class="admin-eyebrow text-highlight">Step {currentPhaseIndex + 1} of 5</p>
				<h2 class="mt-2 font-body text-2xl font-bold text-primary">{phaseTitle[phase]}</h2>

				<div class="mt-8 space-y-5">
					{#each phaseOrder as phaseItem, index}
						<div class="flex items-center gap-4">
							<div
								class={[
									'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold',
									index < currentPhaseIndex
										? 'border-accent bg-accent text-primary'
										: index === currentPhaseIndex
											? 'border-accent bg-primary text-accent'
											: 'border-border bg-white text-muted'
								]}
							>
								{index < currentPhaseIndex ? '✓' : index + 1}
							</div>

							<p class={['font-bold', index === currentPhaseIndex ? 'text-primary' : 'text-muted']}>
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

				{#if programInitialization}<button
						class="absolute top-25 right-3 text-primary rounded-full border border-accent p-2"
						onclick={downloadProgramPdf}><Download class="size-6 cursor-pointer" /></button
					>{/if}

				<div class="space-y-5" bind:this={programCardEl}>
					{#if hasUserAgreement && targetOutcome}
						<TargetOutcomeSummaryCard {targetOutcome} />
					{/if}

					{#if hasUserAgreement && constructionalAssets}
						<div
							class="mb-8 rounded-vintage border border-accent/40 bg-white p-5 text-primary shadow-soft"
						>
							<p class="admin-eyebrow mb-3 text-primary/70">What We Can Build From</p>

							<div class="grid gap-4 md:grid-cols-2">
								<div>
									<h3 class="font-bold">Social interaction</h3>
									<ul class="mt-2 space-y-1 text-sm text-muted-dark">
										<li>Touch: {constructionalAssets.socialReinforcers.touch}</li>
										<li>Talk: {constructionalAssets.socialReinforcers.talk}</li>
										<li>Eye contact: {constructionalAssets.socialReinforcers.eyeContact}</li>
										<li>Closeness: {constructionalAssets.socialReinforcers.proximity}</li>
									</ul>
								</div>

								<div>
									<h3 class="font-bold">Relevant skills</h3>
									<ul class="mt-2 space-y-2 text-sm text-muted-dark">
										{#each constructionalAssets.relevantSkills as skill}
											<li>
												<span class="font-bold text-primary">{skill.name}</span>
												{#if skill.context}
													<span> — {skill.context}</span>
												{/if}
											</li>
										{/each}
									</ul>
								</div>
							</div>

							{#if constructionalAssets.conditionsWhereTargetPatternOccurs.length}
								<div class="mt-5 border-t border-border pt-4">
									<h3 class="font-bold">Where it already happens</h3>

									<ul class="mt-2 space-y-2 text-sm text-muted-dark">
										{#each constructionalAssets.conditionsWhereTargetPatternOccurs as condition}
											<li>
												<span class="font-bold text-primary">{condition.behaviorObserved}</span>
												<span> — {condition.description}</span>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					{/if}

					{#if hasUserAgreement && programInitialization}
						<ProgramInitializationCard {programInitialization} />
					{/if}

					{#each messages as message}
						<div class={['flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start']}>
							{#if message.role === 'coach'}
								<div
									class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary-soft text-primary"
								>
									🐾
								</div>
							{/if}

							<div
								class={[
									'max-w-[78%] rounded-vintage border p-4 leading-7',
									message.role === 'coach'
										? 'border-border bg-secondary-soft text-foreground'
										: 'border-accent/50 bg-primary text-white'
								]}
							>
								<p class="text-sm font-semibold">{message.content}</p>
							</div>
						</div>
					{/each}
				</div>

				{#if phase === 'program_initialization' && !hasUserAgreement && targetOutcome}
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
								disabled={isProcessing}
								rows="1"
								class="min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-foreground placeholder:text-muted outline-none disabled:opacity-60"
								placeholder={isProcessing ? 'Thinking...' : 'Type your answer here...'}></textarea>

							<button
								onclick={submit}
								disabled={isProcessing}
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary shadow-soft transition hover:bg-white disabled:opacity-60"
								aria-label="Continue"
							>
								{isProcessing ? '…' : '➤'}
							</button>
						</div>
					</div>

					<p class="mt-4 text-center text-xs text-muted">
						Your answers are only used to build your program.
					</p>
				{/if}
			</main>
		</div>
	</div>
</section>
