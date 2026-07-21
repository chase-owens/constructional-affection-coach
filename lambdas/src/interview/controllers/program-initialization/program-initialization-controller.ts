import OpenAI from "openai";
import { PROGRAM_INITIALIZATION_INSTRUCTIONS } from "./instructions";
import type {
  ConstructionalAssets,
  ConstructionalProgram,
  InteractionChain,
  LegacyProgramInitialization,
  TargetOutcome,
} from "../../../domain";
import { programInitializationPhaseResultSchema } from "../../../schemas";
import { buildConstructionalProgram } from "./build-constructional-program";

type ProgramInitializationInput = {
  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  interactionChain: InteractionChain;
};

const programInitializationPrompt = `
${PROGRAM_INITIALIZATION_INSTRUCTIONS}

Use the exact key "phaseComplete".

Return ONLY valid JSON in this shape:

{
  "phaseComplete": true,
  "programInitialization": {
    "startingPoint": "...",
    "terminalTargetPattern": "...",
    "programStages": [
      {
        "index": 0,
        "title": "...",
        "targetPattern": "...",
        "entryCondition": "...",
        "successCriterion": "...",
        "reinforcers": ["..."],
        "approximations": [
          {
            "index": 0,
            "dimension": "...",
            "adjustment": "...",
            "targetPattern": "...",
            "successCriterion": "..."
          }
        ],
        "notes": "..."
      }
    ],
    "rationale": "...",
    "notes": "..."
  },
  constructionalProgram": {
    "schemaVersion": "1.0",
    "targetOutcome": {},
    "constructionalAssets": {},
    "controlAnalysis": {
      "targetPattern": "...",
      "initialConditions": {
        "description": "...",
        "behaviorObserved": "...",
        "controllingConditions": ["..."],
        "relevantReinforcer": "...",
        "evidence": ["..."]
      },
      "transitionPoint": {
        "stepIndex": 0,
        "changedCondition": "..."
      },
      "disturbingPattern": "...",
      "terminalConditions": {
        "description": "...",
        "targetPattern": "..."
      }
    },
    "initialization": {
      "startingPoint": "...",
      "terminalTargetPattern": "...",
      "programStages": []
    },
    "transferPlan": {
      "phases": [],
      "terminalCriterion": "..."
    }
  }
}

Do not output markdown.
Do not output explanations.
Always return the phaseComplete key.
Return only JSON.
`;

type ProgramInitializationResult = {
  phaseComplete: true;
  coachMessage?: string;
  programInitialization: LegacyProgramInitialization;
  constructionalProgram: ConstructionalProgram;
};

export class ProgramInitializationController {
  constructor(private readonly openai: OpenAI) {}

  async initialize(
    input: ProgramInitializationInput,
  ): Promise<ProgramInitializationResult> {
    console.log("THE actual controller top");
    const response = await this.openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system" as const,
          content: programInitializationPrompt,
        },
        {
          role: "user" as const,
          content: JSON.stringify(input),
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const parsedJson: unknown = JSON.parse(response.output_text);

    console.log("Legacy program response:", response.output_text);

    const normalizedJson =
      typeof parsedJson === "object" &&
      parsedJson !== null &&
      "phaseComplete" in parsedJson
        ? parsedJson
        : {
            ...(typeof parsedJson === "object" && parsedJson !== null
              ? parsedJson
              : {}),
            phaseComplete: false,
          };

    const legacyResult =
      programInitializationPhaseResultSchema.parse(normalizedJson);

    const constructionalProgram = buildConstructionalProgram({
      targetOutcome: input.targetOutcome,
      constructionalAssets: input.constructionalAssets,
      interactionChain: input.interactionChain,
      programInitialization: legacyResult.programInitialization,
    });

    console.log(
      "Constructional program:",
      JSON.stringify(constructionalProgram),
    );

    return {
      ...legacyResult,
      constructionalProgram,
    };
  }
}
