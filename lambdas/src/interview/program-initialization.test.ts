import { beforeEach, describe, expect, it, vi } from "vitest";
import { runProgramInitialization } from "./program-initialization";
import type OpenAI from "openai";

import { constructionalProgramMock } from "../../../constructional-affection-coach/src/lib/data/constructionalProgram.mock";

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
      interactionChain: constructionalProgramMock.interactionChain,
    });

    expect(result.constructionalProgram).toEqual(constructionalProgramMock);

    expect(initializeMock).toHaveBeenCalledOnce();

    expect(initializeMock).toHaveBeenCalledWith({
      targetOutcome: constructionalProgramMock.targetOutcome,
      constructionalAssets: constructionalProgramMock.constructionalAssets,
      interactionChain: constructionalProgramMock.interactionChain,
    });
  });
});
