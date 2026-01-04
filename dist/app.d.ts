import express from "express";
declare class App {
    app: express.Application;
    constructor();
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
    start(): Promise<void>;
}
declare const app: App;
export default app;
//# sourceMappingURL=app.d.ts.map