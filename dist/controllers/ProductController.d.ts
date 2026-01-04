import { Response } from "express";
export declare class ProductController {
    static createProduct: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getAllProducts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getProductById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getProductBySlug: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateProduct: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static deleteProduct: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static toggleProductStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static toggleFeaturedStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateStock: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getFeaturedProducts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getRelatedProducts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static searchProducts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=ProductController.d.ts.map