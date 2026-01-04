import { ICategory, PaginationQuery, MulterFile } from "../types";
export declare class CategoryService {
    static createCategory(categoryData: {
        name: string;
        description?: string;
        parentCategory?: string;
    }, imageFile?: MulterFile): Promise<import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getAllCategories(query: PaginationQuery & {
        parentCategory?: string;
    }, userRole?: string): Promise<{
        categories: Omit<Omit<import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
            _id: import("mongoose").Types.ObjectId;
        }, never>, never>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    static getCategoryById(id: string, userRole?: string): Promise<import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getCategoryBySlug(slug: string, userRole?: string): Promise<import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updateCategory(id: string, updateData: Partial<ICategory>, imageFile?: MulterFile): Promise<(import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    static deleteCategory(id: string): Promise<{
        message: string;
    }>;
    static toggleCategoryStatus(id: string): Promise<import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getCategoryTree(userRole?: string): Promise<Omit<import("mongoose").Document<unknown, {}, ICategory> & ICategory & {
        _id: import("mongoose").Types.ObjectId;
    }, never>[]>;
}
//# sourceMappingURL=CategoryService.d.ts.map