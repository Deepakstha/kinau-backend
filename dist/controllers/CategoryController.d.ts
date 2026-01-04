import { Response } from "express";
export declare class CategoryController {
    static createCategory: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getAllCategories: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getCategoryById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getCategoryBySlug: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateCategory: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static deleteCategory: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static toggleCategoryStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getCategoryTree: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=CategoryController.d.ts.map