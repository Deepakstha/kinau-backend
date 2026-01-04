"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const mongoose_1 = require("mongoose");
const Cart_1 = require("../models/Cart");
const Product_1 = require("../models/Product");
const ProductVariant_1 = require("../models/ProductVariant");
const errorHandler_1 = require("../middlewares/errorHandler");
class CartService {
    static async getCart(user, options = {}) {
        const { page = 1, limit = 10 } = options;
        const skip = (page - 1) * limit;
        if (user?.role === "admin") {
            const [carts, total] = await Promise.all([
                Cart_1.Cart.find({})
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
                Cart_1.Cart.countDocuments(),
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
        const cart = await Cart_1.Cart.findOne({ user: user?._id })
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
    static async emptyCart(user) {
        const removeCart = await Cart_1.Cart.deleteMany({
            user: user
        });
        return removeCart;
    }
    static async addToCart(user, totalAmount, items) {
        let cart = await Cart_1.Cart.findOne({ user: user._id });
        if (!cart) {
            cart = new Cart_1.Cart({ user: user._id, items: [] });
        }
        for (const item of items) {
            const { product: productId, variant: variantId, quantity, price } = item;
            const product = await Product_1.Product.findById(productId);
            if (!product || !product.isActive) {
                throw (0, errorHandler_1.createError)(`Product ${productId} not found or inactive`, 404);
            }
            let variant = null;
            if (variantId) {
                variant = await ProductVariant_1.ProductVariant.findById(variantId);
                if (!variant ||
                    !variant.isActive ||
                    variant.product.toString() !== productId) {
                    throw (0, errorHandler_1.createError)(`Product variant ${variantId} not found or inactive`, 404);
                }
                if (variant.stock < quantity) {
                    throw (0, errorHandler_1.createError)(`Insufficient stock available for variant ${variantId}`, 400);
                }
            }
            const existingItemIndex = cart.items.findIndex((cartItem) => cartItem.product.toString() === productId &&
                (variantId
                    ? cartItem.variant?.toString() === variantId
                    : !cartItem.variant));
            if (existingItemIndex > -1) {
                if (!cart.items[existingItemIndex]) {
                    throw (0, errorHandler_1.createError)("Item not found in cart", 404);
                }
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;
                if (variant && variant.stock < newQuantity) {
                    throw (0, errorHandler_1.createError)(`Insufficient stock available for variant ${variantId}`, 400);
                }
                cart.items[existingItemIndex].quantity = newQuantity;
                cart.items[existingItemIndex].price = price;
            }
            else {
                const cartItem = {
                    product: new mongoose_1.Types.ObjectId(productId),
                    variant: variantId ? new mongoose_1.Types.ObjectId(variantId) : undefined,
                    quantity,
                    price,
                };
                cart.items.push(cartItem);
            }
        }
        cart.totalAmount = totalAmount;
        await cart.save();
        return await this.getCart(user);
    }
    static async updateCartItem(user, totalAmount, items) {
        const cart = await Cart_1.Cart.findOne({ user: user._id });
        if (!cart) {
            throw (0, errorHandler_1.createError)("Cart not found", 404);
        }
        const updatedItems = [];
        for (const item of items) {
            const { product: productId, variant: variantId, quantity, price } = item;
            const existingItemIndex = updatedItems.findIndex((cartItem) => cartItem.product.toString() === productId &&
                (variantId
                    ? cartItem.variant?.toString() === variantId
                    : !cartItem.variant));
            if (existingItemIndex > -1) {
                if (!updatedItems[existingItemIndex]) {
                    throw (0, errorHandler_1.createError)("Item not found in cart", 404);
                }
                updatedItems[existingItemIndex].quantity += quantity;
                if (updatedItems[existingItemIndex].price !== price) {
                    throw (0, errorHandler_1.createError)(`Prices for ${productId} ${variantId} in cart are different`, 400);
                }
            }
            else {
                const cartItem = {
                    product: new mongoose_1.Types.ObjectId(productId),
                    variant: variantId ? new mongoose_1.Types.ObjectId(variantId) : undefined,
                    quantity,
                    price,
                };
                if (variantId) {
                    const variant = await ProductVariant_1.ProductVariant.findById(variantId);
                    if (!variant) {
                        throw (0, errorHandler_1.createError)(`Product variant ${variantId} not found`, 404);
                    }
                    if (variant.stock < cartItem.quantity) {
                        throw (0, errorHandler_1.createError)(`Insufficient stock available for variant ${variantId}`, 400);
                    }
                }
                updatedItems.push(cartItem);
            }
        }
        cart.totalAmount = totalAmount;
        cart.items = updatedItems;
        await cart.save();
        return await this.getCart(user);
    }
    static async removeFromCart(user, productId, variantId) {
        const cart = await Cart_1.Cart.findOne({ user: user._id });
        if (!cart) {
            throw (0, errorHandler_1.createError)("Cart not found", 404);
        }
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
            (variantId ? item.variant?.toString() === variantId : !item.variant));
        if (itemIndex === -1) {
            throw (0, errorHandler_1.createError)("Item not found in cart", 404);
        }
        cart.items.splice(itemIndex, 1);
        await cart.save();
        return await this.getCart(user);
    }
    static async clearCart(user) {
        const cart = await Cart_1.Cart.findOne({ user: user._id });
        if (!cart) {
            throw (0, errorHandler_1.createError)("Cart not found", 404);
        }
        cart.items = [];
        await cart.save();
        return cart;
    }
    static async getCartSummary(user) {
        if (user.role === "admin") {
            const [carts, totalCarts] = await Promise.all([
                Cart_1.Cart.find({}).populate({
                    path: "items.product",
                    select: "name price",
                }),
                Cart_1.Cart.countDocuments(),
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
                averageItemsPerCart: totalCarts > 0 ? (totalItems / totalCarts).toFixed(2) : 0,
                averageCartValue: totalCarts > 0 ? (totalRevenue / totalCarts).toFixed(2) : 0,
            };
        }
        const cart = (await this.getCart(user));
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
    static async validateCartItems(user) {
        const cart = await Cart_1.Cart.findOne({ user: user._id });
        if (!cart) {
            return { valid: true, issues: [] };
        }
        const issues = [];
        const validItems = [];
        for (const item of cart.items) {
            const product = await Product_1.Product.findById(item.product);
            if (!product || !product.isActive) {
                issues.push(`Product ${item.product} is no longer available`);
                continue;
            }
            if (item.variant) {
                const variant = await ProductVariant_1.ProductVariant.findById(item.variant);
                if (!variant || !variant.isActive) {
                    issues.push(`Product variant is no longer available`);
                    continue;
                }
                if (variant.stock < item.quantity) {
                    issues.push(`Only ${variant.stock} items available for ${product.name}`);
                    item.quantity = variant.stock;
                }
                const currentPrice = variant.discountPrice || variant.price;
                if (item.price !== currentPrice) {
                    item.price = currentPrice;
                    issues.push(`Price updated for ${product.name}`);
                }
                if (variant.stock > 0) {
                    validItems.push(item);
                }
            }
            else {
                if (item.price !== product.basePrice) {
                    item.price = product.basePrice;
                    issues.push(`Price updated for ${product.name}`);
                }
                validItems.push(item);
            }
        }
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
exports.CartService = CartService;
//# sourceMappingURL=CartService.js.map