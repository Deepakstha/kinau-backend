import { Response } from "express";
export declare class AuthController {
    static register: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static login: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static refreshToken: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getProfile: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateProfile: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static changePassword: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static logout: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=AuthController.d.ts.map