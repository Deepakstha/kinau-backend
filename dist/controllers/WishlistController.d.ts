import { Response } from "express";
export declare class WishlistController {
    static getWishlist: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static addToWishlist: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static removeFromWishlist: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static clearWishlist: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static checkWishlistStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getWishlistCount: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static deleteWishlist: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static moveToCart: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=WishlistController.d.ts.map