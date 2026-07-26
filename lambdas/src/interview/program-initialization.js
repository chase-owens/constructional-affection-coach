"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runProgramInitialization = void 0;
const program_initialization_controller_1 = require("./controllers/program-initialization/program-initialization-controller");
const runProgramInitialization = async (openai, input) => {
    console.log("calling controller");
    const controller = new program_initialization_controller_1.ProgramInitializationController(openai);
    return controller.initialize(input);
};
exports.runProgramInitialization = runProgramInitialization;
