type LogLevel =
  | "log"
  | "info"
  | "warn"
  | "error"
  | "debug"
  | "table"
  | "time"
  | "timeEnd"
  | "trace";

type Logger = {
  [K in LogLevel]: K extends "table"
    ? (tabularData: any, properties?: string[] | undefined) => void
    : K extends "time" | "timeEnd"
    ? (label?: string | undefined) => void
    : (...args: any[]) => void;
};

const noop = (): void => {};

const createLogger = (): Logger => {
  // Only log in development mode
  const shouldLog = process.env.NODE_ENV === "development";

  // Create a proxy to handle all console methods
  const handler: ProxyHandler<Console> = {
    get(target, prop: LogLevel) {
      if (shouldLog) {
        const method = target[prop];
        if (typeof method === "function") {
          return method.bind(console);
        }
      }
      return noop;
    },
  };

  return new Proxy(console, handler) as unknown as Logger;
};

// Create the logger instance
export const logger = createLogger();

// Type-safe logger with all console methods
export default {
  log: (...args: any[]) => logger.log(...args),
  info: (...args: any[]) => logger.info(...args),
  warn: (...args: any[]) => logger.warn(...args),
  error: (...args: any[]) => logger.error(...args),
  debug: (...args: any[]) => logger.debug(...args),
  table: (tabularData: any, properties?: string[]) =>
    logger.table(tabularData, properties),
  time: (label?: string) => logger.time(label),
  timeEnd: (label?: string) => logger.timeEnd(label),
  trace: (...args: any[]) => logger.trace(...args),
} as const;
