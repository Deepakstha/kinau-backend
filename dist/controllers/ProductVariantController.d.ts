import { Response } from "express";
export declare class ProductVariantController {
    static createVariant: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getVariantsByProduct: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getVariantById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateVariant: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static deleteVariant: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static toggleVariantStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateStock: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=ProductVariantController.d.ts.map