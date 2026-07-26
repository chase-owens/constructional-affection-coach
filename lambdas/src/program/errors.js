"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramPersistenceError = exports.ProgramGenerationError = exports.ProgramValidationError = exports.InterviewPhaseValidationError = void 0;
class InterviewPhaseValidationError extends Error {
    phase;
    validationError;
    code = "INTERVIEW_PHASE_VALIDATION_FAILED";
    constructor(phase, validationError) {
        super(`Generated ${phase} response failed schema validation.`);
        this.phase = phase;
        this.validationError = validationError;
        this.name = "InterviewPhaseValidationError";
    }
}
exports.InterviewPhaseValidationError = InterviewPhaseValidationError;
class ProgramValidationError extends Error {
    validationError;
    code = "PROGRAM_VALIDATION_FAILED";
    constructor(validationError) {
        super("Generated program failed schema validation.");
        this.validationError = validationError;
        this.name = "ProgramValidationError";
    }
}
exports.ProgramValidationError = ProgramValidationError;
class ProgramGenerationError extends Error {
    code = "PROGRAM_GENERATION_FAILED";
    constructor(message = "Constructional program generation failed.", options) {
        super(message, options);
        this.name = "ProgramGenerationError";
    }
}
exports.ProgramGenerationError = ProgramGenerationError;
class ProgramPersistenceError extends Error {
    code = "PROGRAM_PERSISTENCE_FAILED";
    constructor(message = "Constructional program persistence failed.", options) {
        super(message, options);
        this.name = "ProgramPersistenceError";
    }
}
exports.ProgramPersistenceError = ProgramPersistenceError;
