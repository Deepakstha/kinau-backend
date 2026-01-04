"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./index");
class Database {
    constructor() { }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        console.log(index_1.config.MONGODB_URI, "config");
        try {
            const mongoUri = index_1.config.NODE_ENV === "test"
                ? index_1.config.MONGODB_TEST_URI
                : index_1.config.MONGODB_URI;
            await mongoose_1.default.connect(mongoUri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                bufferCommands: false,
            });
            console.log(`✅ MongoDB connected successfully to ${index_1.config.NODE_ENV} database`);
            mongoose_1.default.connection.on("error", (error) => {
                console.error("❌ MongoDB connection error:", error);
            });
            mongoose_1.default.connection.on("disconnected", () => {
                console.log("⚠️ MongoDB disconnected");
            });
            mongoose_1.default.connection.on("reconnected", () => {
                console.log("✅ MongoDB reconnected");
            });
            process.on("SIGINT", async () => {
                await this.disconnect();
                process.exit(0);
            });
        }
        catch (error) {
            console.error("❌ MongoDB connection failed:", error);
            process.exit(1);
        }
    }
    async disconnect() {
        try {
            await mongoose_1.default.connection.close();
            console.log("✅ MongoDB connection closed");
        }
        catch (error) {
            console.error("❌ Error closing MongoDB connection:", error);
        }
    }
    getConnection() {
        return mongoose_1.default.connection;
    }
}
exports.default = Database;
//# sourceMappingURL=database.js.map