"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET_OUTCOME_OUT_OF_SCOPE_EXAMPLES = exports.TARGET_OUTCOME_EXAMPLES = exports.TARGET_OUTCOME_EXIT_CRITERIA = exports.DEFAULT_TARGET_OUTCOME = exports.TARGET_OUTCOME_QUESTION = void 0;
exports.TARGET_OUTCOME_QUESTION = "Assuming this process is successful, what would the outcome be?";
exports.DEFAULT_TARGET_OUTCOME = {
    rawAnswer: "",
    clarifiedOutcome: "",
    desiredInteractionPattern: "",
    primaryContext: null,
    scope: "needs_clarification",
    isPositive: false,
    isObservable: false,
};
exports.TARGET_OUTCOME_EXIT_CRITERIA = {
    isPositive: true,
    isObservable: true,
    scope: "within_constructional_affection",
};
exports.TARGET_OUTCOME_EXAMPLES = [
    "Calmly waits for affection.",
    "Politely greets visitors.",
    "Lies quietly while I work.",
];
exports.TARGET_OUTCOME_OUT_OF_SCOPE_EXAMPLES = [
    "Guard the family.",
    "Potty train.",
    "Eliminate prey drive.",
    "Loose leash walking.",
    "Stop reacting to other dogs.",
];
