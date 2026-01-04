import { Router } from "express";
interface RouteExample {
    method: string;
    path: string;
    body?: any;
    params?: Record<string, any>;
    query?: Record<string, any>;
}
export declare function registerRoutes(path: string, router: Router, name: string, examples?: RouteExample[]): Router;
export declare function getAllRegisteredRoutes(): {
    name: string;
    basePath: string;
    routes: {
        example: any;
        path: string;
        method: string;
    }[];
}[];
export {};
//# sourceMappingURL=routeRegistry.d.ts.map