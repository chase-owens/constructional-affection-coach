type LogLevel = "INFO" | "WARN" | "ERROR";

type LogContext = Record<string, unknown>;

const writeLog = (level: LogLevel, event: string, context: LogContext = {}) => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      event,
      ...context,
    }),
  );
};

export const logger = {
  info: (event: string, context?: LogContext) =>
    writeLog("INFO", event, context),
  warn: (event: string, context?: LogContext) =>
    writeLog("WARN", event, context),
  error: (event: string, context?: LogContext) =>
    writeLog("ERROR", event, context),
};
