export type ControlAnalysis = {
  targetPattern: string;

  initialConditions: {
    description: string;
    behaviorObserved: string;
    controllingConditions: string[];
    relevantReinforcer: string;
    evidence: string[];
  };

  transitionPoint: {
    stepIndex: number;
    changedCondition: string;
  };

  disturbingPattern: string;

  terminalConditions: {
    description: string;
    targetPattern: string;
  };
};
