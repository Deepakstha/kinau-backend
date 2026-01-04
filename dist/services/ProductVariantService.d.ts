import { IProductVariant, MulterFile } from "../types";
export declare class ProductVariantService {
    static createVariant(productId: string, variantData: {
        size: string;
        color: string;
        sku: string;
        price: number;
        discountPrice?: number;
        stock: number;
    }, imageFile?: MulterFile): Promise<(import("mongoose").Document<unknown, {}, IProductVariant> & IProductVariant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    static getVariantsByProduct(productId: string, userRole?: string): Promise<Omit<Omit<Omit<import("mongoose").Document<unknown, {}, IProductVariant> & IProductVariant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, never>, never>, never>[]>;
    static getVariantById(variantId: string, userRole?: string): Promise<import("mongoose").Document<unknown, {}, IProductVariant> & IProductVariant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    static updateVariant(variantId: string, updateData: IProductVariant, imageFile?: MulterFile): Promise<(import("mongoose").Document<unknown, {}, IProductVariant> & IProductVariant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    static deleteVariant(variantId: string): Promise<{
        message: string;
    }>;
    static toggleVariantStatus(variantId: string): Promise<import("mongoose").Document<unknown, {}, IProductVariant> & IProductVariant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    static updateStock(variantId: string, newStock: number): Promise<import("mongoose").Document<unknown, {}, IProductVariant> & IProductVariant & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
//# sourceMappingURL=ProductVariantService.d.ts.map