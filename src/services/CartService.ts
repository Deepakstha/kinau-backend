import { Types } from "mongoose";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { ProductVariant } from "../models/ProductVariant";
import { ICart, ICartItem, IPopulatedCartItem, IUser } from "../types";
import { createError } from "../middlewares/errorHandler";

// Add interface for populated cart
export interface IPopulatedCart extends Omit<ICart, "items"> {
  items: IPopulatedCartItem[];
}

export class CartService {
  static async getCart(
    user?: IUser,
    options: { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    if (user?.role === "admin") {
      const [carts, total] = await Promise.all([
        Cart.find({})
          .populate({
            path: "user",
            select: "name email",
          })
          .populate({
            path: "items.product",
            select: "name slug mainImages isActive basePrice",
            populate: [
              { path: "category", select: "name slug" },
              {
                path: "variants",
                select: "sku price discountPrice stock image isActive",
              },
            ],
          })
          .populate({
            path: "items.variant",
            select: "sku price discountPrice stock image isActive",
            populate: [
              { path: "size", select: "name code" },
              { path: "color", select: "name hexCode" },
            ],
          })
          .skip(skip)
          .limit(limit)
          .lean(),
        Cart.countDocuments(),
      ]);

      return {
        carts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    }

    // For non-admin users or unauthenticated users
    const cart = await Cart.findOne({ user: user?._id })
      .populate({
        path: "items.product",
        select: "name slug mainImages isActive basePrice",
        populate: [
          { path: "category", select: "name slug" },
          {
            path: "variants",
            select: "sku price discountPrice stock image isActive",
          },
        ],
      })
      .populate({
        path: "items.variant",
        select: "sku price discountPrice stock image isActive",
        populate: [
          { path: "size", select: "name code" },
          { path: "color", select: "name hexCode" },
        ],
      });

    return cart;
  }

  static async emptyCart(user: IUser){
    const removeCart = await Cart.deleteMany({
      user: user
    })
    return removeCart;
  } 

  static async addToCart(
    user: IUser,
    totalAmount: number,
    items: Array<{
      product: string;
      variant?: string;
      quantity: number;
      price: number;
    }>
  ) {
    // Get or create cart
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    // Process each item in the items array
    for (const item of items) {
      const { product: productId, variant: variantId, quantity, price } = item;

      // Validate product
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        throw createError(`Product ${productId} not found or inactive`, 404);
      }

      let variant = null;

      // If variant is specified, validate it
      if (variantId) {
        variant = await ProductVariant.findById(variantId);

        if (
          !variant ||
          !variant.isActive ||
          variant.product.toString() !== productId
        ) {
          throw createError(
            `Product variant ${variantId} not found or inactive`,
            404
          );
        }

        if (variant.stock < quantity) {
          throw createError(
            `Insufficient stock available for variant ${variantId}`,
            400
          );
        }
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (cartItem) =>
          cartItem.product.toString() === productId &&
          (variantId
            ? cartItem.variant?.toString() === variantId
            : !cartItem.variant)
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        if (!cart.items[existingItemIndex]) {
          throw createError("Item not found in cart", 404);
        }
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        // Check stock for variants
        if (variant && variant.stock < newQuantity) {
          throw createError(
            `Insufficient stock available for variant ${variantId}`,
            400
          );
        }

        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].price = price;
      } else {
        // Add new item to cart
        const cartItem: ICartItem = {
          product: new Types.ObjectId(productId),
          variant: variantId ? new Types.ObjectId(variantId) : undefined,
          quantity,
          price,
        };
        cart.items.push(cartItem);
      }
    }

    // Set the total amount from request
    cart.totalAmount = totalAmount;

    await cart.save();
    return await this.getCart(user);
  }

  static async updateCartItem(
    user: IUser,
    totalAmount: number,
    items: Array<{
      product: string;
      variant?: string;
      quantity: number;
      price: number;
    }>
  ) {
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      throw createError("Cart not found", 404);
    }

    // Process each item in the items array
    const updatedItems: ICartItem[] = [];

    for (const item of items) {
      const { product: productId, variant: variantId, quantity, price } = item;

      const existingItemIndex = updatedItems.findIndex(
        (cartItem) =>
          cartItem.product.toString() === productId &&
          (variantId
            ? cartItem.variant?.toString() === variantId
            : !cartItem.variant)
      );

      if (existingItemIndex > -1) {
        // Merge quantities for repeated items
        if (!updatedItems[existingItemIndex]) {
          throw createError("Item not found in cart", 404);
        }
        updatedItems[existingItemIndex].quantity += quantity;
        if (updatedItems[existingItemIndex].price !== price) {
          throw createError(
            `Prices for ${productId} ${variantId} in cart are different`,
            400
          );
        }
      } else {
        // Add new item to cart
        const cartItem: ICartItem = {
          product: new Types.ObjectId(productId),
          variant: variantId ? new Types.ObjectId(variantId) : undefined,
          quantity,
          price,
        };

        // Check stock availability for variants
        if (variantId) {
          const variant = await ProductVariant.findById(variantId);
          if (!variant) {
            throw createError(`Product variant ${variantId} not found`, 404);
          }

          if (variant.stock < cartItem.quantity) {
            throw createError(
              `Insufficient stock available for variant ${variantId}`,
              400
            );
          }
        }

        updatedItems.push(cartItem);
      }
    }

    // Set the total amount from request
    cart.totalAmount = totalAmount;
    cart.items = updatedItems;

    await cart.save();
    return await this.getCart(user);
  }

  static async removeFromCart(
    user: IUser,
    productId: string,
    variantId?: string
  ) {
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      throw createError("Cart not found", 404);
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (variantId ? item.variant?.toString() === variantId : !item.variant)
    );

    if (itemIndex === -1) {
      throw createError("Item not found in cart", 404);
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    return await this.getCart(user);
  }

  static async clearCart(user: IUser) {
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      throw createError("Cart not found", 404);
    }

    cart.items = [];
    await cart.save();

    return cart;
  }

  static async getCartSummary(user: IUser) {
    if (user.role === "admin") {
      const [carts, totalCarts] = await Promise.all([
        Cart.find({}).populate({
          path: "items.product",
          select: "name price",
        }),
        Cart.countDocuments(),
      ]);

      const allItems = carts.flatMap((cart) => cart.items);
      const totalItems = allItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = allItems.reduce((sum, item) => {
        const price = item.price || 0;
        return sum + price * item.quantity;
      }, 0);

      return {
        totalCarts,
        totalItems,
        totalRevenue,
        averageItemsPerCart:
          totalCarts > 0 ? (totalItems / totalCarts).toFixed(2) : 0,
        averageCartValue:
          totalCarts > 0 ? (totalRevenue / totalCarts).toFixed(2) : 0,
      };
    }

    // For regular users
    const cart = (await this.getCart(user)) as IPopulatedCart;
    if (!cart) {
      return {
        itemCount: 0,
        subTotal: 0,
        items: 0,
      };
    }

    return {
      itemCount: cart.items.reduce((total, item) => total + item.quantity, 0),
      subTotal: cart.totalAmount,
      items: cart.items.length,
    };
  }

  static async validateCartItems(user: IUser) {
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return { valid: true, issues: [] };
    }

    const issues: string[] = [];
    const validItems: ICartItem[] = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        issues.push(`Product ${item.product} is no longer available`);
        continue;
      }

      if (item.variant) {
        // Product with variant
        const variant = await ProductVariant.findById(item.variant);
        if (!variant || !variant.isActive) {
          issues.push(`Product variant is no longer available`);
          continue;
        }

        if (variant.stock < item.quantity) {
          issues.push(
            `Only ${variant.stock} items available for ${product.name}`
          );
          // Adjust quantity to available stock
          item.quantity = variant.stock;
        }

        // Update price if changed
        const currentPrice = variant.discountPrice || variant.price;
        if (item.price !== currentPrice) {
          item.price = currentPrice;
          issues.push(`Price updated for ${product.name}`);
        }

        if (variant.stock > 0) {
          validItems.push(item);
        }
      } else {
        // Product without variant
        // Update price if changed
        if (item.price !== product.basePrice) {
          item.price = product.basePrice;
          issues.push(`Price updated for ${product.name}`);
        }

        validItems.push(item);
      }
    }

    // Update cart with valid items
    if (issues.length > 0) {
      cart.items = validItems;
      await cart.save();
    }

    return {
      valid: issues.length === 0,
      issues,
      cart: await this.getCart(user),
    };
  }

}
