import OpenAI from "openai";
import { PROGRAM_INITIALIZATION_INSTRUCTIONS } from "./instructions";
import type {
  ConstructionalAssets,
  ConstructionalProgram,
  InteractionChain,
  TargetOutcome,
} from "../../../domain";
import type { ValidationIssue } from "../../program-initialization";

type ProgramInitializationInput = {
  targetOutcome: TargetOutcome;
  constructionalAssets: ConstructionalAssets;
  interactionChain: InteractionChain;
  validationIssues?: ValidationIssue[];
};

const programInitializationPrompt = `
${PROGRAM_INITIALIZATION_INSTRUCTIONS}

Use the exact key "phaseComplete".

Return ONLY valid JSON in this shape:

{
  "phaseComplete": true,
  "constructionalProgram": {
    "schemaVersion": "1.0",
    "targetOutcome": {
      "rawAnswer": "...",
      "clarifiedOutcome": "...",
      "desiredInteractionPattern": "...",
      "primaryContext": "...",
      "scope": "within_constructional_affection",
      "isPositive": true,
      "isObservable": true,
      "notes": "..."
    },
    "constructionalAssets": {
      "socialReinforcers": {
        "touch": "unclear",
        "talk": "unclear",
        "eyeContact": "unclear",
        "proximity": "unclear"
      },
      "relevantSkills": [],
      "conditionsWhereTargetPatternOccurs": [],
      "notes": "..."
    },
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
      "initialApproximation": {
        "id": "...",
        "order": 0,
        "conditions": ["..."],
        "changeFromPrevious": {
          "dimension": "...",
          "adjustment": "..."
        },
        "targetPattern": "...",
        "reinforcer": "...",
        "controlCriterion": {
          "evidenceOfControl": "...",
          "sufficientToAdvance": "..."
        },
        "recovery": {
          "reduceApproximationTo": "...",
          "previousSuccessfulApproximationId": "..."
        }
      },
      "readinessCriterion": "..."
    },
    "transferPlan": {
      "phases": [
        {
          "id": "...",
          "order": 0,
          "title": "...",
          "entryCondition": "...",
          "targetPattern": "...",
          "terminalCriterion": "...",
          "reinforcers": ["..."],
          "notes": "...",
          "approximations": [
            {
              "id": "...",
              "order": 0,
              "conditions": ["..."],
              "changeFromPrevious": {
                "dimension": "...",
                "adjustment": "..."
              },
              "targetPattern": "...",
              "reinforcer": "...",
              "controlCriterion": {
                "evidenceOfControl": "...",
                "sufficientToAdvance": "..."
              },
              "recovery": {
                "reduceApproximationTo": "...",
                "previousSuccessfulApproximationId": "..."
              }
            }
          ]
        }
      ],
      "terminalCriterion": "..."
    }
  }
}

Use the supplied targetOutcome and constructionalAssets without changing their meaning.

Do not output markdown.
Do not output explanations.
Always return the phaseComplete key.
Return only JSON.
`;

type ProgramInitializationResult = {
  phaseComplete: true;
  constructionalProgram: unknown;
};

export class ProgramInitializationController {
  constructor(private readonly openai: OpenAI) {}

  async initialize(
    input: ProgramInitializationInput,
  ): Promise<ProgramInitializationResult> {
    console.log("THE actual controller top");

    const validationFeedback = input.validationIssues?.length
      ? `
          The constructional program built from your previous programInitialization
          failed schema validation.

          Revise the complete programInitialization so the resulting constructional
          program resolves every issue below:

          ${input.validationIssues
            .map((issue) => {
              const path =
                issue.path.length > 0
                  ? issue.path.map(String).join(".")
                  : "root";

              return `- ${path}: ${issue.message}`;
            })
            .join("\n")}

          Return the complete corrected result.
          Do not return only the corrected properties.
          `
      : "";

    const response = await this.openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system" as const,
          content: programInitializationPrompt,
        },
        {
          role: "user" as const,
          content: `
            Interview data:

            ${JSON.stringify(
              {
                targetOutcome: input.targetOutcome,
                constructionalAssets: input.constructionalAssets,
                interactionChain: input.interactionChain,
              },
              null,
              2,
            )}

            ${validationFeedback}
            `,
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    const parsedJson: unknown = JSON.parse(response.output_text);

    if (
      typeof parsedJson !== "object" ||
      parsedJson === null ||
      !("constructionalProgram" in parsedJson)
    ) {
      return {
        phaseComplete: true,
        constructionalProgram: undefined,
      };
    }

    const result = parsedJson as {
      phaseComplete?: unknown;
      constructionalProgram?: unknown;
    };

    console.info("program.controller.completed");

    return {
      phaseComplete: true,
      constructionalProgram: result.constructionalProgram,
    };
  }
}
