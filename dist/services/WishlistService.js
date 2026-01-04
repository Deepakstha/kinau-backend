"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const Wishlist_1 = require("../models/Wishlist");
const Product_1 = require("../models/Product");
const errorHandler_1 = require("../middlewares/errorHandler");
const mongoose_1 = require("mongoose");
class WishlistService {
    static async getWishlist(userId) {
        let wishlist = await Wishlist_1.Wishlist.findOne({ user: userId }).populate({
            path: "items.product",
            select: "name slug mainImages basePrice isActive isFeatured",
            populate: {
                path: "category",
                select: "name slug",
            },
        });
        if (!wishlist) {
            wishlist = new Wishlist_1.Wishlist({ user: userId, items: [] });
            await wishlist.save();
        }
        return wishlist;
    }
    static async addToWishlist(userId, productId) {
        const product = await Product_1.Product.findById(productId);
        if (!product || !product.isActive) {
            throw (0, errorHandler_1.createError)("Product not found or inactive", 404);
        }
        let wishlist = await Wishlist_1.Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist_1.Wishlist({ user: userId, items: [] });
        }
        const existingItem = wishlist.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            throw (0, errorHandler_1.createError)("Product already in wishlist", 400);
        }
        wishlist.items.push({
            product: new mongoose_1.Types.ObjectId(productId),
            addedAt: new Date(),
        });
        await wishlist.save();
        return await this.getWishlist(userId);
    }
    static async removeFromWishlist(userId, productId) {
        const wishlist = await Wishlist_1.Wishlist.findOne({ user: userId });
        if (!wishlist) {
            throw (0, errorHandler_1.createError)("Wishlist not found", 404);
        }
        const itemIndex = wishlist.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            throw (0, errorHandler_1.createError)("Product not found in wishlist", 404);
        }
        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();
        return await this.getWishlist(userId);
    }
    static async clearWishlist(userId) {
        const wishlist = await Wishlist_1.Wishlist.findOne({ user: userId });
        if (!wishlist) {
            throw (0, errorHandler_1.createError)("Wishlist not found", 404);
        }
        wishlist.items = [];
        await wishlist.save();
        return wishlist;
    }
    static async isInWishlist(userId, productId) {
        const wishlist = await Wishlist_1.Wishlist.findOne({ user: userId });
        if (!wishlist) {
            return false;
        }
        return wishlist.items.some((item) => item.product.toString() === productId);
    }
    static async getWishlistCount(userId) {
        const wishlist = await Wishlist_1.Wishlist.findOne({ user: userId });
        return wishlist ? wishlist.items.length : 0;
    }
    static async deleteWishlist(userId, productId) {
        const wishlist = await Wishlist_1.Wishlist.findOne({ user: userId });
        if (!wishlist) {
            throw (0, errorHandler_1.createError)("Wishlist not found", 404);
        }
        const itemIndex = wishlist.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            throw (0, errorHandler_1.createError)("Product not found in wishlist", 404);
        }
        wishlist.items.splice(itemIndex, 1);
        await wishlist.save();
        return wishlist;
    }
    static async moveToCart(userId, productId, variationData) {
        await this.removeFromWishlist(userId, productId);
        return { message: "Item moved to cart successfully" };
    }
}
exports.WishlistService = WishlistService;
//# sourceMappingURL=WishlistService.js.map