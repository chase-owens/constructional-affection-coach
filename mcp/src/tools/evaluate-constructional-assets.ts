import OpenAI from "openai";
import { z } from "zod";

import {
  constructionalAssetsSchema,
  evaluationResultSchema,
  type EvaluationResult,
} from "@constructional-affection/domain";

export const EVALUATE_CONSTRUCTIONAL_ASSETS_TOOL_NAME =
  "evaluate_constructional_assets";

export const evaluateConstructionalAssetsInputSchema = z.object({
  constructionalAssets: constructionalAssetsSchema,
});

export type EvaluateConstructionalAssetsInput = z.infer<
  typeof evaluateConstructionalAssetsInputSchema
>;

type ConstructionalAssetsToolProps = {
  openai: OpenAI;
  input: EvaluateConstructionalAssetsInput;
};

export const evaluateConstructionalAssets = async ({
  openai,
  input,
}: ConstructionalAssetsToolProps): Promise<EvaluationResult> => {
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
          You are evaluating Constructional Assets for methodological consistency.

          Evaluate whether the reported evidence semantically supports the assigned social reinforcer classifications.

          The classifications are:

          - clearly_reinforcing
          - sometimes_reinforcing
          - unclear
          - not_reinforcing
          - over_arousing

          Do not evaluate by keyword matching.

          Interpret common descriptions semantically rather than literally.

          Examples:
           - "being praised"
           - "being told she's a good girl"
           - "he loves hearing my voice"

           all support talk

           - "cuddles"
           - "snuggling"
           - "lying on my"

           all support touch

          Interpret the meaning of the evidence and the functional relationship it describes.

          A classification should only be considered unsupported when the evidence contradicts it or fails to reasonably support it.

          An "unclear" classification is considered valid when the available evidence does not establish a stronger conclusion. Do not report supported "unclear" classifications as issues.

          Constructional Affection inference rules:
          - Social reinforcement is supported by evidence of voluntary approach (nearing) or sustained close proximity to the person in the absence of distancing or escape behavior.
          - Proximity is supported by sustained interactions with a person in the absence of distancing or escape behavior.
          - Distancing or escape behaviors support the conclusion that social interaction is not reinforcing.
          - Do not infer talk or eye contact unless the evidence reasonably supports those classifications.

          Return valid=true when touch and proximity are "clearly_reinforcing", "sometimes_reinforcing", or "over_arousing".

          Return only valid JSON in this shape:

          {
            "valid": true,
            "issues": []
          }

          or

          {
            "valid": false,
            "issues": [
              "..."
            ]
          }

          Do not output markdown.
          Do not output explanations outside the JSON.
          `.trim(),
      },
      {
        role: "user",
        content: `Evaluate these Constructional Assets:

      ${JSON.stringify(input.constructionalAssets, null, 2)}
      `.trim(),
      },
    ],
    text: {
      format: {
        type: "json_object",
      },
    },
  });

  const parsed = JSON.parse(response.output_text);

  return evaluationResultSchema.parse(parsed);
};
