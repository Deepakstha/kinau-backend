import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
export declare const authenticate: (req: import("express").Request, res: Response, next: NextFunction) => void;
export declare const authorize: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const optionalAuth: (req: import("express").Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map