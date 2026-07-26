"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const writeLog = (level, event, context = {}) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        event,
        ...context,
    }));
};
exports.logger = {
    info: (event, context) => writeLog("INFO", event, context),
    warn: (event, context) => writeLog("WARN", event, context),
    error: (event, context) => writeLog("ERROR", event, context),
};
