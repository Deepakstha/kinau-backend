import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import Database from "./config/database";
import { config } from "./config";
import routes from "./routes/index";
import swaggerSpec from "./config/swagger";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.set("trust proxy", 2); // Trust the first proxy

    this.app.use((req, res, next) => {
      console.log("X-Forwarded-For:", req.headers["x-forwarded-for"]);
      console.log("req.ip:", req.ip);
      console.log("req.ips:", req.ips);
      next();
    });
    // Security middleware
    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Rate limiting
    // const limiter = rateLimit({
    //   windowMs: config.RATE_LIMIT_WINDOW_MS,
    //   max: config.RATE_LIMIT_MAX_REQUESTS,
    //   message: {
    //     success: false,
    //     message: "Too many requests from this IP, please try again later.",
    //   },
    // });

    // this.app.use(limiter);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());

    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }

    // Swagger documentation
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "E-commerce API Documentation",
      })
    );
  }

  private initializeRoutes(): void {
    this.app.use("/api", routes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(globalErrorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database connection
      const database = Database.getInstance();
      await database.connect();

      // Start the server
      const PORT = config.PORT || 5000;
      this.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(
          `API Documentation available at http://localhost:${PORT}/api-docs`
        );
      });
    } catch (error) {
      console.error("Failed to start the server:", error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();
app.start();

export default app;
