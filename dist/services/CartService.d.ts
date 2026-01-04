import { Types } from "mongoose";
import { ICart, IPopulatedCartItem, IUser } from "../types";
export interface IPopulatedCart extends Omit<ICart, "items"> {
    items: IPopulatedCartItem[];
}
export declare class CartService {
    static getCart(user?: IUser, options?: {
        page?: number;
        limit?: number;
    }): Promise<(import("mongoose").Document<unknown, {}, ICart> & ICart & {
        _id: Types.ObjectId;
    }) | {
        carts: (import("mongoose").FlattenMaps<ICart> & {
            _id: Types.ObjectId;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    } | null>;
    static emptyCart(user: IUser): Promise<import("mongodb").DeleteResult>;
    static addToCart(user: IUser, totalAmount: number, items: Array<{
        product: string;
        variant?: string;
        quantity: number;
        price: number;
    }>): Promise<(import("mongoose").Document<unknown, {}, ICart> & ICart & {
        _id: Types.ObjectId;
    }) | {
        carts: (import("mongoose").FlattenMaps<ICart> & {
            _id: Types.ObjectId;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    } | null>;
    static updateCartItem(user: IUser, totalAmount: number, items: Array<{
        product: string;
        variant?: string;
        quantity: number;
        price: number;
    }>): Promise<(import("mongoose").Document<unknown, {}, ICart> & ICart & {
        _id: Types.ObjectId;
    }) | {
        carts: (import("mongoose").FlattenMaps<ICart> & {
            _id: Types.ObjectId;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    } | null>;
    static removeFromCart(user: IUser, productId: string, variantId?: string): Promise<(import("mongoose").Document<unknown, {}, ICart> & ICart & {
        _id: Types.ObjectId;
    }) | {
        carts: (import("mongoose").FlattenMaps<ICart> & {
            _id: Types.ObjectId;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    } | null>;
    static clearCart(user: IUser): Promise<import("mongoose").Document<unknown, {}, ICart> & ICart & {
        _id: Types.ObjectId;
    }>;
    static getCartSummary(user: IUser): Promise<{
        totalCarts: number;
        totalItems: number;
        totalRevenue: number;
        averageItemsPerCart: string | number;
        averageCartValue: string | number;
        itemCount?: undefined;
        subTotal?: undefined;
        items?: undefined;
    } | {
        itemCount: number;
        subTotal: number;
        items: number;
        totalCarts?: undefined;
        totalItems?: undefined;
        totalRevenue?: undefined;
        averageItemsPerCart?: undefined;
        averageCartValue?: undefined;
    }>;
    static validateCartItems(user: IUser): Promise<{
        valid: boolean;
        issues: never[];
        cart?: undefined;
    } | {
        valid: boolean;
        issues: string[];
        cart: (import("mongoose").Document<unknown, {}, ICart> & ICart & {
            _id: Types.ObjectId;
        }) | {
            carts: (import("mongoose").FlattenMaps<ICart> & {
                _id: Types.ObjectId;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                pages: number;
            };
        } | null;
    }>;
}
//# sourceMappingURL=CartService.d.ts.map