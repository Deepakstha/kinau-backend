import { Types } from "mongoose";
export declare class WishlistService {
    static getWishlist(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IWishlist> & import("../types").IWishlist & {
        _id: Types.ObjectId;
    }>;
    static addToWishlist(userId: string, productId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IWishlist> & import("../types").IWishlist & {
        _id: Types.ObjectId;
    }>;
    static removeFromWishlist(userId: string, productId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IWishlist> & import("../types").IWishlist & {
        _id: Types.ObjectId;
    }>;
    static clearWishlist(userId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IWishlist> & import("../types").IWishlist & {
        _id: Types.ObjectId;
    }>;
    static isInWishlist(userId: string, productId: string): Promise<boolean>;
    static getWishlistCount(userId: string): Promise<number>;
    static deleteWishlist(userId: string, productId: string): Promise<import("mongoose").Document<unknown, {}, import("../types").IWishlist> & import("../types").IWishlist & {
        _id: Types.ObjectId;
    }>;
    static moveToCart(userId: string, productId: string, variationData: {
        size: string;
        color: string;
        sku: string;
    }): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=WishlistService.d.ts.map