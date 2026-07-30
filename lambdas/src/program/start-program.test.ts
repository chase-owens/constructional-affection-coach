import { beforeEach, describe, expect, it, vi } from "vitest";

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

const event = {
  interviewId: "test-interview-id",
  metadata: PROGRAM_INITIALIZATION_BASELINE,
  targetOutcome: constructionalProgramMock.targetOutcome,
  constructionalAssets: constructionalProgramMock.constructionalAssets,
  interactionChain,
};

const mocks = vi.hoisted(() => ({
  documentSend: vi.fn(),
  getOpenAiClient: vi.fn(),
  runProgramInitialization: vi.fn(),
}));

vi.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: class {},
}));

vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: {
    from: vi.fn(() => ({
      send: mocks.documentSend,
    })),
  },

  UpdateCommand: class {
    constructor(public readonly input: unknown) {}
  },
}));

vi.mock("../interview/get-openai-client", () => ({
  getOpenAiClient: mocks.getOpenAiClient,
}));

vi.mock("../interview/program-initialization", () => ({
  runProgramInitialization: mocks.runProgramInitialization,
}));

// Import AFTER declaring the mocks.
// vi.mock is hoisted by Vitest, but keeping this here makes the test's
// dependency setup easier to understand.
import { handler } from "./start-program";
import { afterEach } from "node:test";
import {
  InteractionChain,
  PROGRAM_INITIALIZATION_BASELINE,
} from "@constructional-affection/domain";
import { constructionalProgramMock } from "../test/fixtures/constructionalProgram.mock";

describe("start-program", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.TABLE_NAME = "test-interviews-table";

    mocks.documentSend.mockResolvedValue({});
    mocks.getOpenAiClient.mockResolvedValue({});
  });

  afterEach(() => {
    delete process.env.TABLE_NAME;
  });

  it("fails when TABLE_NAME is not configured", async () => {
    delete process.env.TABLE_NAME;

    await expect(handler(event)).rejects.toThrow(
      "TABLE_NAME is not configured",
    );
  });

  it("retries program generation with validation issues when the first program fails schema validation", async () => {
    const invalidProgram = {
      ...constructionalProgramMock,

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
        constructionalProgram: constructionalProgramMock,
      });

    await handler(event);

    expect(mocks.runProgramInitialization).toHaveBeenCalledTimes(2);

    const firstCallInput = mocks.runProgramInitialization.mock.calls[0][1];

    expect(firstCallInput.validationIssues).toBeUndefined();

    const secondCallInput = mocks.runProgramInitialization.mock.calls[1][1];

    expect(secondCallInput.validationIssues).toBeDefined();
    expect(secondCallInput.validationIssues.length).toBeGreaterThan(0);

    expect(secondCallInput.validationIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: expect.any(Array),
          message: expect.any(String),
        }),
      ]),
    );

    // processing → complete
    expect(mocks.documentSend).toHaveBeenCalledTimes(2);
  });

  it("marks the program failed when every generated program fails schema validation", async () => {
    const invalidProgram = {
      ...constructionalProgramMock,
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

    await handler(event);

    expect(mocks.runProgramInitialization).toHaveBeenCalledTimes(2);

    const secondCallInput = mocks.runProgramInitialization.mock.calls[1][1];

    expect(secondCallInput.validationIssues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["schemaVersion"],
        }),
      ]),
    );

    // processing → failed
    expect(mocks.documentSend).toHaveBeenCalledTimes(2);

    const failedCommand = mocks.documentSend.mock.calls[1][0];

    expect(failedCommand.input.ExpressionAttributeValues).toMatchObject({
      ":status": "failed",
      ":errorCode": "PROGRAM_VALIDATION_FAILED",
    });
  });

  it("marks the program failed when generation returns no constructional program", async () => {
    mocks.runProgramInitialization.mockResolvedValueOnce({
      phaseComplete: true,
      constructionalProgram: undefined,
    });

    await handler(event);

    expect(mocks.runProgramInitialization).toHaveBeenCalledOnce();

    // processing → failed
    expect(mocks.documentSend).toHaveBeenCalledTimes(2);

    const failedCommand = mocks.documentSend.mock.calls[1][0];

    expect(failedCommand.input.ExpressionAttributeValues).toMatchObject({
      ":status": "failed",
      ":errorCode": "PROGRAM_GENERATION_FAILED",
    });
  });

  it("persists the program without retrying when the first generated program is valid", async () => {
    mocks.runProgramInitialization.mockResolvedValueOnce({
      phaseComplete: true,
      constructionalProgram: constructionalProgramMock,
    });

    await handler(event);

    expect(mocks.runProgramInitialization).toHaveBeenCalledOnce();

    const firstCallInput = mocks.runProgramInitialization.mock.calls[0][1];

    expect(firstCallInput.validationIssues).toBeUndefined();

    // processing → complete
    expect(mocks.documentSend).toHaveBeenCalledTimes(2);

    const completeCommand = mocks.documentSend.mock.calls[1][0];

    expect(completeCommand.input.ExpressionAttributeValues).toMatchObject({
      ":status": "complete",
      ":program": constructionalProgramMock,
    });
  });
});
