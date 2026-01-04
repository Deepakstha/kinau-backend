import { Response } from "express";
export declare class CartController {
    static getCart: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static addToCart: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateCartItem: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static removeFromCart: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static removeFromCartWithoutVariant: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static clearCart: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getCartSummary: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static validateCart: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=CartController.d.ts.map