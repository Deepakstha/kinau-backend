type LogLevel = "log" | "info" | "warn" | "error" | "debug" | "table" | "time" | "timeEnd" | "trace";
type Logger = {
    [K in LogLevel]: K extends "table" ? (tabularData: any, properties?: string[] | undefined) => void : K extends "time" | "timeEnd" ? (label?: string | undefined) => void : (...args: any[]) => void;
};
export declare const logger: Logger;
declare const _default: {
    readonly log: (...args: any[]) => void;
    readonly info: (...args: any[]) => void;
    readonly warn: (...args: any[]) => void;
    readonly error: (...args: any[]) => void;
    readonly debug: (...args: any[]) => void;
    readonly table: (tabularData: any, properties?: string[]) => void;
    readonly time: (label?: string) => void;
    readonly timeEnd: (label?: string) => void;
    readonly trace: (...args: any[]) => void;
};
export default _default;
//# sourceMappingURL=logger.d.ts.map