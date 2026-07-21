import type {
  ConstructionalAssets,
  ConstructionalProgram,
  ControlAnalysis,
  InteractionChain,
  LegacyProgramInitialization,
  ProgramInitialization,
  TargetOutcome,
} from "../../../domain";
import type {
  Approximation,
  LegacyApproximation,
  ProgramPhase,
} from "../../../domain/transfer-step";

type BuildConstructionalProgramArgs = {
  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  interactionChain: InteractionChain;
  programInitialization: LegacyProgramInitialization;
};

export const toProgramPhase = (
  stage: LegacyProgramInitialization["programStages"][number],
): ProgramPhase => ({
  id: `phase-${stage.index}`,
  order: stage.index,
  title: stage.title,
  entryCondition: stage.entryCondition,
  targetPattern: stage.targetPattern,
  terminalCriterion: stage.successCriterion,
  reinforcers: stage.reinforcers,
  notes: stage.notes,
  approximations: stage.approximations.map((approximation, index) =>
    toApproximation(stage, approximation, index),
  ),
});

const toApproximation = (
  stage: LegacyProgramInitialization["programStages"][number],
  approximation: LegacyApproximation,
  approximationIndex: number,
): Approximation => ({
  id: `phase-${stage.index}-approximation-${approximation.index}`,
  order: approximationIndex,

  conditions: [stage.entryCondition],

  changeFromPrevious: {
    dimension: approximation.dimension,
    adjustment: approximation.adjustment,
  },

  targetPattern: approximation.targetPattern,
  reinforcer: stage.reinforcers.join(", "),

  controlCriterion: {
    evidenceOfControl: approximation.successCriterion,
    sufficientToAdvance: approximation.successCriterion,
  },

  recovery: {
    previousSuccessfulApproximationId:
      approximationIndex > 0
        ? `phase-${stage.index}-approximation-${approximationIndex - 1}`
        : undefined,
  },
});

export const buildConstructionalProgram = ({
  targetOutcome,
  constructionalAssets,
  interactionChain,
  programInitialization,
}: BuildConstructionalProgramArgs): ConstructionalProgram => {
  const startingStep =
    interactionChain.steps[interactionChain.constructionStartIndex];

  const firstTransferStep = interactionChain.steps.find(
    (step) => step.requiresTransfer,
  );

  if (!startingStep) {
    throw new Error(
      "Cannot construct program without a valid construction start step.",
    );
  }

  if (!firstTransferStep) {
    throw new Error(
      "Cannot construct program without a step requiring transfer.",
    );
  }

  const evidence = constructionalAssets.conditionsWhereTargetPatternOccurs.map(
    ({ description, behaviorObserved }) =>
      `${description}: ${behaviorObserved}`,
  );

  const relevantReinforcer = [
    constructionalAssets.socialReinforcers.touch === "clearly_reinforcing"
      ? "touch"
      : null,
    constructionalAssets.socialReinforcers.talk === "clearly_reinforcing"
      ? "talk"
      : null,
    constructionalAssets.socialReinforcers.eyeContact === "clearly_reinforcing"
      ? "eye contact"
      : null,
    constructionalAssets.socialReinforcers.proximity === "clearly_reinforcing"
      ? "proximity"
      : null,
  ]
    .filter((value): value is string => Boolean(value))
    .join(", ");

  const controlAnalysis: ControlAnalysis = {
    targetPattern:
      targetOutcome.desiredInteractionPattern ??
      programInitialization.terminalTargetPattern,

    initialConditions: {
      description: startingStep.description,
      behaviorObserved:
        startingStep.change ??
        startingStep.expectedDogBehavior ??
        programInitialization.startingPoint,
      controllingConditions: [],
      relevantReinforcer,
      evidence,
    },

    transitionPoint: {
      stepIndex: firstTransferStep.index,
      changedCondition: firstTransferStep.description,
    },

    disturbingPattern:
      firstTransferStep.change ??
      firstTransferStep.notes ??
      "The target pattern is no longer present.",

    terminalConditions: {
      description:
        targetOutcome.primaryContext ??
        programInitialization.terminalTargetPattern,

      targetPattern: programInitialization.terminalTargetPattern,
    },
  };

  const phases = programInitialization.programStages.map(toProgramPhase);

  const initialApproximation = phases[0]?.approximations[0];

  if (!initialApproximation) {
    throw new Error(
      "Cannot construct a program without an initial approximation.",
    );
  }

  const initialization: ProgramInitialization = {
    initialApproximation,
    readinessCriterion:
      programInitialization.programStages[0]?.entryCondition ??
      "The target pattern is stable under the initial conditions.",
  };

  return {
    schemaVersion: "1.0",
    targetOutcome,
    constructionalAssets,
    controlAnalysis,

    initialization,

    transferPlan: {
      phases,
      terminalCriterion: programInitialization.terminalTargetPattern,
    },
  };
};
