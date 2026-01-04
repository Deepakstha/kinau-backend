"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = __importDefault(require("./config/database"));
const config_1 = require("./config");
const index_1 = __importDefault(require("./routes/index"));
const swagger_1 = __importDefault(require("./config/swagger"));
const errorHandler_1 = require("./middlewares/errorHandler");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.set("trust proxy", 2);
        this.app.use((req, res, next) => {
            console.log("X-Forwarded-For:", req.headers["x-forwarded-for"]);
            console.log("req.ip:", req.ip);
            console.log("req.ips:", req.ips);
            next();
        });
        this.app.use((0, helmet_1.default)({
            crossOriginResourcePolicy: { policy: "cross-origin" },
        }));
        this.app.use((0, cors_1.default)({
            origin: "*",
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, compression_1.default)());
        if (process.env.NODE_ENV === "development") {
            this.app.use((0, morgan_1.default)("dev"));
        }
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "E-commerce API Documentation",
        }));
    }
    initializeRoutes() {
        this.app.use("/api", index_1.default);
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.notFoundHandler);
        this.app.use(errorHandler_1.globalErrorHandler);
    }
    async start() {
        try {
            const database = database_1.default.getInstance();
            await database.connect();
            const PORT = config_1.config.PORT || 5000;
            this.app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
                console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
            });
        }
        catch (error) {
            console.error("Failed to start the server:", error);
            process.exit(1);
        }
    }
}
const app = new App();
app.start();
exports.default = app;
//# sourceMappingURL=app.js.map