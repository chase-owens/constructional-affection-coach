"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const program_initialization_1 = require("./program-initialization");
const constructionalProgram_mock_1 = require("../test/fixtures/constructionalProgram.mock");
const interactionChain = {
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
const initializeMock = vitest_1.vi.fn();
vitest_1.vi.mock("./controllers/program-initialization/program-initialization-controller", () => ({
    ProgramInitializationController: class {
        initialize = initializeMock;
    },
}));
(0, vitest_1.describe)("runProgramInitialization", () => {
    const openai = {};
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("returns the constructional program produced by the controller", async () => {
        initializeMock.mockResolvedValue({
            phaseComplete: true,
            constructionalProgram: constructionalProgram_mock_1.constructionalProgramMock,
        });
        const result = await (0, program_initialization_1.runProgramInitialization)(openai, {
            targetOutcome: constructionalProgram_mock_1.constructionalProgramMock.targetOutcome,
            constructionalAssets: constructionalProgram_mock_1.constructionalProgramMock.constructionalAssets,
            interactionChain,
        });
        (0, vitest_1.expect)(result.constructionalProgram).toEqual(constructionalProgram_mock_1.constructionalProgramMock);
        (0, vitest_1.expect)(initializeMock).toHaveBeenCalledOnce();
        (0, vitest_1.expect)(initializeMock).toHaveBeenCalledWith({
            targetOutcome: constructionalProgram_mock_1.constructionalProgramMock.targetOutcome,
            constructionalAssets: constructionalProgram_mock_1.constructionalProgramMock.constructionalAssets,
            interactionChain,
        });
    });
});
