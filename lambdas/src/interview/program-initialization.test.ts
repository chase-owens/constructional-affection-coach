import { beforeEach, describe, expect, it, vi } from "vitest";
import { runProgramInitialization } from "./program-initialization";
import type OpenAI from "openai";
import { constructionalProgramMock } from "../test/fixtures/constructionalProgram.mock";
import { InteractionChain } from "@constructional-affection/domain";
import { MODEL_IDS } from "../../../domain/src/evaluation/model-ids";

const interactionChain: InteractionChain = {
  steps: [
    {
      index: 0,
      actor: "person",
      description: "Person stands near the couch.",
      change: "No change yet.",
      expectedDogBehavior: "Dog remains calm.",
      targetPatternPresent: true,
      requiresTransfer: false,
    },
    {
      index: 1,
      actor: "person",
      description: "Person begins sitting down.",
      change: "Person bends toward the couch.",
      expectedDogBehavior: "Dog begins moving toward the person.",
      targetPatternPresent: false,
      requiresTransfer: true,
    },
  ],
  constructionStartIndex: 0,
  targetOutcomeIndex: 1,
  notes: "",
};

const initializeMock = vi.fn();

vi.mock(
  "./controllers/program-initialization/program-initialization-controller",
  () => ({
    ProgramInitializationController: class {
      initialize = initializeMock;
    },
  }),
);

describe("runProgramInitialization", () => {
  const openai = {} as OpenAI;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the constructional program produced by the controller", async () => {
    initializeMock.mockResolvedValue({
      phaseComplete: true,
      constructionalProgram: constructionalProgramMock,
    });

    const result = await runProgramInitialization(openai, {
      modelId: MODEL_IDS.GPT_4_1_MINI,
      targetOutcome: constructionalProgramMock.targetOutcome,
      constructionalAssets: constructionalProgramMock.constructionalAssets,
      interactionChain,
    });

    expect(result.constructionalProgram).toEqual(constructionalProgramMock);

    expect(initializeMock).toHaveBeenCalledOnce();

    expect(initializeMock).toHaveBeenCalledWith({
      modelId: MODEL_IDS.GPT_4_1_MINI,
      targetOutcome: constructionalProgramMock.targetOutcome,
      constructionalAssets: constructionalProgramMock.constructionalAssets,
      interactionChain,
    });
  });
});
