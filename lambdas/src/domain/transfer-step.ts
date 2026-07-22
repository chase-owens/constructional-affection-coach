export type ProgramPhase = {
  id: string;
  order: number;
  title: string;
  entryCondition: string;
  targetPattern: string;
  terminalCriterion: string;
  reinforcers: string[];
  notes?: string;
  approximations: Approximation[];
};

export type Approximation = {
  id: string;
  order: number;

  conditions: string[];

  changeFromPrevious: {
    dimension: string;
    adjustment: string;
  };

  targetPattern: string;
  reinforcer: string;

  controlCriterion: {
    evidenceOfControl: string;
    sufficientToAdvance: string;
  };

  recovery: {
    reduceApproximationTo?: string;
    previousSuccessfulApproximationId?: string;
  };
};
