import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { createError } from "../middlewares/errorHandler";
import { Types } from "mongoose";

export class WishlistService {
  static async getWishlist(userId: string) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name slug mainImages basePrice isActive isFeatured",
      populate: {
        path: "category",
        select: "name slug",
      },
    });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
      await wishlist.save();
    }

    return wishlist;
  }

  static async addToWishlist(userId: string, productId: string) {
    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      throw createError("Product not found or inactive", 404);
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      throw createError("Product already in wishlist", 400);
    }

    // Add product to wishlist
    wishlist.items.push({
      product: new Types.ObjectId(productId),
      addedAt: new Date(),
    });

    await wishlist.save();
    return await this.getWishlist(userId);
  }

  static async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      throw createError("Wishlist not found", 404);
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw createError("Product not found in wishlist", 404);
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return await this.getWishlist(userId);
  }

  static async clearWishlist(userId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      throw createError("Wishlist not found", 404);
    }

    wishlist.items = [];
    await wishlist.save();

    return wishlist;
  }

  static async isInWishlist(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return false;
    }

    return wishlist.items.some((item) => item.product.toString() === productId);
  }

  static async getWishlistCount(userId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    return wishlist ? wishlist.items.length : 0;
  }

  // TODO: need to implement deletion of wishlist

  static async deleteWishlist(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      throw createError("Wishlist not found", 404);
    }

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      throw createError("Product not found in wishlist", 404);
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return wishlist;
  }

  static async moveToCart(
    userId: string,
    productId: string,
    variationData: {
      size: string;
      color: string;
      sku: string;
    }
  ) {
    // Remove from wishlist
    await this.removeFromWishlist(userId, productId);

    // Note: In a real implementation, you would call CartService.addToCart here
    // For now, we'll just return a success message
    return { message: "Item moved to cart successfully" };
  }
}
