import mongoose from "mongoose";
declare class Database {
    private static instance;
    private constructor();
    static getInstance(): Database;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getConnection(): mongoose.Connection;
}
export default Database;
//# sourceMappingURL=database.d.ts.map