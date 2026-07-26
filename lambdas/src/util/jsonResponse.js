"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonResponse = (statusCode, body, sendRaw = false) => ({
    statusCode,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,PATCH,GET,PUT",
    },
    body: sendRaw ? body : JSON.stringify(body),
});
exports.default = jsonResponse;
