"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const noop = () => { };
const createLogger = () => {
    const shouldLog = process.env.NODE_ENV === "development";
    const handler = {
        get(target, prop) {
            if (shouldLog) {
                const method = target[prop];
                if (typeof method === "function") {
                    return method.bind(console);
                }
            }
            return noop;
        },
    };
    return new Proxy(console, handler);
};
exports.logger = createLogger();
exports.default = {
    log: (...args) => exports.logger.log(...args),
    info: (...args) => exports.logger.info(...args),
    warn: (...args) => exports.logger.warn(...args),
    error: (...args) => exports.logger.error(...args),
    debug: (...args) => exports.logger.debug(...args),
    table: (tabularData, properties) => exports.logger.table(tabularData, properties),
    time: (label) => exports.logger.time(label),
    timeEnd: (label) => exports.logger.timeEnd(label),
    trace: (...args) => exports.logger.trace(...args),
};
//# sourceMappingURL=logger.js.map