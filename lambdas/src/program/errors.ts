import type { ZodError } from "zod";

export class ProgramValidationError extends Error {
  readonly code = "PROGRAM_VALIDATION_FAILED";

  constructor(readonly validationError: ZodError) {
    super("Generated program failed schema validation.");
    this.name = "ProgramValidationError";
  }
}

export class ProgramGenerationError extends Error {
  readonly code = "PROGRAM_GENERATION_FAILED";

  constructor(
    message = "Constructional program generation failed.",
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ProgramGenerationError";
  }
}

export class ProgramPersistenceError extends Error {
  readonly code = "PROGRAM_PERSISTENCE_FAILED";

  constructor(
    message = "Constructional program persistence failed.",
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ProgramPersistenceError";
  }
}
