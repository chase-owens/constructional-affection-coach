"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
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
const event = {
    interviewId: "test-interview-id",
    targetOutcome: constructionalProgram_mock_1.constructionalProgramMock.targetOutcome,
    constructionalAssets: constructionalProgram_mock_1.constructionalProgramMock.constructionalAssets,
    interactionChain,
};
const mocks = vitest_1.vi.hoisted(() => ({
    documentSend: vitest_1.vi.fn(),
    getOpenAiClient: vitest_1.vi.fn(),
    runProgramInitialization: vitest_1.vi.fn(),
}));
vitest_1.vi.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: class {
    },
}));
vitest_1.vi.mock("@aws-sdk/lib-dynamodb", () => ({
    DynamoDBDocumentClient: {
        from: vitest_1.vi.fn(() => ({
            send: mocks.documentSend,
        })),
    },
    UpdateCommand: class {
        input;
        constructor(input) {
            this.input = input;
        }
    },
}));
vitest_1.vi.mock("../interview/get-openai-client", () => ({
    getOpenAiClient: mocks.getOpenAiClient,
}));
vitest_1.vi.mock("../interview/program-initialization", () => ({
    runProgramInitialization: mocks.runProgramInitialization,
}));
// Import AFTER declaring the mocks.
// vi.mock is hoisted by Vitest, but keeping this here makes the test's
// dependency setup easier to understand.
const start_program_1 = require("./start-program");
const node_test_1 = require("node:test");
const constructionalProgram_mock_1 = require("../test/fixtures/constructionalProgram.mock");
(0, vitest_1.describe)("start-program", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        process.env.TABLE_NAME = "test-interviews-table";
        mocks.documentSend.mockResolvedValue({});
        mocks.getOpenAiClient.mockResolvedValue({});
    });
    (0, node_test_1.afterEach)(() => {
        delete process.env.TABLE_NAME;
    });
    (0, vitest_1.it)("fails when TABLE_NAME is not configured", async () => {
        delete process.env.TABLE_NAME;
        await (0, vitest_1.expect)((0, start_program_1.handler)(event)).rejects.toThrow("TABLE_NAME is not configured");
    });
    (0, vitest_1.it)("retries program generation with validation issues when the first program fails schema validation", async () => {
        const invalidProgram = {
            ...constructionalProgram_mock_1.constructionalProgramMock,
            // Deliberately violate the schema.
            schemaVersion: 123,
        };
        mocks.runProgramInitialization
            .mockResolvedValueOnce({
            phaseComplete: true,
            constructionalProgram: invalidProgram,
        })
            .mockResolvedValueOnce({
            phaseComplete: true,
            constructionalProgram: constructionalProgram_mock_1.constructionalProgramMock,
        });
        await (0, start_program_1.handler)(event);
        (0, vitest_1.expect)(mocks.runProgramInitialization).toHaveBeenCalledTimes(2);
        const firstCallInput = mocks.runProgramInitialization.mock.calls[0][1];
        (0, vitest_1.expect)(firstCallInput.validationIssues).toBeUndefined();
        const secondCallInput = mocks.runProgramInitialization.mock.calls[1][1];
        (0, vitest_1.expect)(secondCallInput.validationIssues).toBeDefined();
        (0, vitest_1.expect)(secondCallInput.validationIssues.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(secondCallInput.validationIssues).toEqual(vitest_1.expect.arrayContaining([
            vitest_1.expect.objectContaining({
                path: vitest_1.expect.any(Array),
                message: vitest_1.expect.any(String),
            }),
        ]));
        // processing → complete
        (0, vitest_1.expect)(mocks.documentSend).toHaveBeenCalledTimes(2);
    });
    (0, vitest_1.it)("marks the program failed when every generated program fails schema validation", async () => {
        const invalidProgram = {
            ...constructionalProgram_mock_1.constructionalProgramMock,
            schemaVersion: 123,
        };
        mocks.runProgramInitialization
            .mockResolvedValueOnce({
            phaseComplete: true,
            constructionalProgram: invalidProgram,
        })
            .mockResolvedValueOnce({
            phaseComplete: true,
            constructionalProgram: invalidProgram,
        });
        await (0, start_program_1.handler)(event);
        (0, vitest_1.expect)(mocks.runProgramInitialization).toHaveBeenCalledTimes(2);
        const secondCallInput = mocks.runProgramInitialization.mock.calls[1][1];
        (0, vitest_1.expect)(secondCallInput.validationIssues).toEqual(vitest_1.expect.arrayContaining([
            vitest_1.expect.objectContaining({
                path: ["schemaVersion"],
            }),
        ]));
        // processing → failed
        (0, vitest_1.expect)(mocks.documentSend).toHaveBeenCalledTimes(2);
        const failedCommand = mocks.documentSend.mock.calls[1][0];
        (0, vitest_1.expect)(failedCommand.input.ExpressionAttributeValues).toMatchObject({
            ":status": "failed",
            ":errorCode": "PROGRAM_VALIDATION_FAILED",
        });
    });
    (0, vitest_1.it)("marks the program failed when generation returns no constructional program", async () => {
        mocks.runProgramInitialization.mockResolvedValueOnce({
            phaseComplete: true,
            constructionalProgram: undefined,
        });
        await (0, start_program_1.handler)(event);
        (0, vitest_1.expect)(mocks.runProgramInitialization).toHaveBeenCalledOnce();
        // processing → failed
        (0, vitest_1.expect)(mocks.documentSend).toHaveBeenCalledTimes(2);
        const failedCommand = mocks.documentSend.mock.calls[1][0];
        (0, vitest_1.expect)(failedCommand.input.ExpressionAttributeValues).toMatchObject({
            ":status": "failed",
            ":errorCode": "PROGRAM_GENERATION_FAILED",
        });
    });
    (0, vitest_1.it)("persists the program without retrying when the first generated program is valid", async () => {
        mocks.runProgramInitialization.mockResolvedValueOnce({
            phaseComplete: true,
            constructionalProgram: constructionalProgram_mock_1.constructionalProgramMock,
        });
        await (0, start_program_1.handler)(event);
        (0, vitest_1.expect)(mocks.runProgramInitialization).toHaveBeenCalledOnce();
        const firstCallInput = mocks.runProgramInitialization.mock.calls[0][1];
        (0, vitest_1.expect)(firstCallInput.validationIssues).toBeUndefined();
        // processing → complete
        (0, vitest_1.expect)(mocks.documentSend).toHaveBeenCalledTimes(2);
        const completeCommand = mocks.documentSend.mock.calls[1][0];
        (0, vitest_1.expect)(completeCommand.input.ExpressionAttributeValues).toMatchObject({
            ":status": "complete",
            ":program": constructionalProgram_mock_1.constructionalProgramMock,
        });
    });
});
