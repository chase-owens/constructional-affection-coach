import { beforeEach, describe, expect, it, vi } from "vitest";
import { runProgramInitialization } from "./program-initialization";
import type OpenAI from "openai";
import { constructionalProgramMock } from "../test/fixtures/constructionalProgram.mock";
import { InteractionChain } from "../schemas";

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
      targetOutcome: constructionalProgramMock.targetOutcome,
      constructionalAssets: constructionalProgramMock.constructionalAssets,
      interactionChain,
    });

    expect(result.constructionalProgram).toEqual(constructionalProgramMock);

    expect(initializeMock).toHaveBeenCalledOnce();

    expect(initializeMock).toHaveBeenCalledWith({
      targetOutcome: constructionalProgramMock.targetOutcome,
      constructionalAssets: constructionalProgramMock.constructionalAssets,
      interactionChain,
    });
  });
});
