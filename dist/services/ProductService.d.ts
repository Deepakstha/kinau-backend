import { IProduct, MulterFile, PaginationQuery } from "../types";
interface ProductQuery extends PaginationQuery {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    inStock?: boolean;
    brand?: string;
    tags?: string[];
}
export declare class ProductService {
    static createProduct(productData: {
        name: string;
        description: string;
        shortDescription?: string;
        category: string;
        brand?: string;
        basePrice: number;
        tags?: string[];
        weight?: number;
        dimensions?: any;
        seoTitle?: string;
        seoDescription?: string;
    }, mainImages?: MulterFile[]): Promise<(import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    static getAllProducts(query: ProductQuery, userRole?: string): Promise<{
        products: Omit<Omit<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
            _id: import("mongoose").Types.ObjectId;
        }, never>, never>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    static getProductById(id: string, userRole?: string): Promise<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getProductBySlug(slug: string, userRole?: string): Promise<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updateProduct(id: string, updateData: Partial<IProduct>, mainImages?: MulterFile[]): Promise<(import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    static deleteProduct(id: string): Promise<{
        message: string;
    }>;
    static toggleProductStatus(id: string): Promise<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static toggleFeaturedStatus(id: string): Promise<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getFeaturedProducts(limit?: number, userRole?: string): Promise<Omit<Omit<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>[]>;
    static getRelatedProducts(productId: string, limit?: number, userRole?: string): Promise<Omit<Omit<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>[]>;
    static searchProducts(searchTerm: string, limit?: number, userRole?: string): Promise<Omit<Omit<import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }, never>, never>[]>;
    static updateStock(productId: string, sku: string, stock: number): Promise<(import("mongoose").Document<unknown, {}, IProduct> & IProduct & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
export {};
//# sourceMappingURL=ProductService.d.ts.map