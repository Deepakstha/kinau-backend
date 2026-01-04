"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const index_1 = require("../enum/index");
const errorHandler_1 = require("../middlewares/errorHandler");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const ShippingAddress_1 = require("../models/ShippingAddress");
const CartService_1 = require("./CartService");
class OrderService {
    static async createOrder(userId, orderData) {
        const { shippingAddressId, paymentMethod, notes } = orderData;
        const cartResult = await CartService_1.CartService.getCart(userId);
        if (!cartResult) {
            throw (0, errorHandler_1.createError)("Cart not found", 404);
        }
        const cart = "carts" in cartResult ? cartResult.carts[0] : cartResult;
        if (!cart || cart.items.length === 0) {
            throw (0, errorHandler_1.createError)("Cart is empty", 400);
        }
        console.log(" COMMING...");
        const shippingAddress = await ShippingAddress_1.ShippingAddress.findOne({
            _id: shippingAddressId,
            user: userId,
        });
        console.log(shippingAddress, " SHIPPING ADDRESS");
        if (!shippingAddress) {
            throw (0, errorHandler_1.createError)("Shipping address not found", 404);
        }
        let subtotal = 0;
        const orderItems = [];
        for (const cartItem of cart.items) {
            const product = cartItem.product;
            if (!product.isActive) {
                throw (0, errorHandler_1.createError)(`Product ${product.name} is no longer available`, 400);
            }
            console.log(cartItem, " CARTITEM");
            const variantSku = typeof cartItem.variant === "object" && cartItem.variant !== null
                ? cartItem.variant.sku
                : null;
            if (!variantSku) {
                throw (0, errorHandler_1.createError)("Product variation not found", 400);
            }
            const variation = product.variants.find((v) => v.sku === variantSku);
            if (!variation) {
                throw (0, errorHandler_1.createError)(`Product variation not found`, 400);
            }
            if (variation.stock < cartItem.quantity) {
                throw (0, errorHandler_1.createError)(`Insufficient stock for ${product.name}`, 400);
            }
            const itemTotal = variation.price * cartItem.quantity;
            subtotal += itemTotal;
            orderItems.push({
                product: product._id,
                name: product.name,
                sku: cartItem.variant &&
                    typeof cartItem.variant === "object" &&
                    "sku" in cartItem.variant
                    ? cartItem.variant.sku
                    : undefined,
                size: cartItem.variant &&
                    typeof cartItem.variant === "object" &&
                    "size" in cartItem.variant
                    ? cartItem.variant.size
                    : undefined,
                color: cartItem.variant &&
                    typeof cartItem.variant === "object" &&
                    "color" in cartItem.variant
                    ? cartItem.variant.color
                    : undefined,
                price: variation.price,
                quantity: cartItem.quantity,
                total: itemTotal,
                image: product.mainImages[0] || "",
            });
        }
        const shippingCost = subtotal > 100 ? 0 : 10;
        const taxRate = 0.08;
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;
        console.log(shippingAddress, " THIS IS COMMING......");
        const order = new Order_1.Order({
            user: userId,
            items: orderItems,
            subtotal,
            shippingCost,
            tax,
            total,
            shippingAddress: {
                firstName: shippingAddress.firstName,
                lastName: shippingAddress.lastName,
                phone: shippingAddress.phone,
                addressLine1: shippingAddress.addressLine1,
                addressLine2: shippingAddress.addressLine2 || "",
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.postalCode,
                country: shippingAddress.country,
            },
            paymentMethod,
            notes,
            status: index_1.OrderStatus.PENDING,
            paymentStatus: index_1.PaymentStatus.PENDING,
        });
        await order.save();
        for (const cartItem of cart.items) {
            const variant = cartItem.variant;
            if (!variant?.sku) {
                throw new Error("Variant SKU is required for stock update");
            }
            await Product_1.Product.updateOne({ _id: cartItem.product, "variations.sku": variant.sku }, { $inc: { "variations.$.stock": -cartItem.quantity } });
        }
        cart.items = [];
        cart.totalAmount = 0;
        await CartService_1.CartService.emptyCart(userId);
        return order;
    }
    static async getMonthlyOrdersAndSalesByMonths(year, months) {
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        console.log(months, " MONTHS");
        const result = await Order_1.Order.aggregate([
            {
                $match: {
                    paymentStatus: "paid",
                    createdAt: { $gte: start, $lte: end },
                    $expr: {
                        $in: [{ $month: "$createdAt" }, months],
                    },
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$createdAt" } },
                    totalOrders: { $sum: 1 },
                    totalSales: { $sum: "$total" },
                },
            },
            { $sort: { "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    totalOrders: 1,
                    totalSales: 1,
                },
            },
        ]);
        return result;
    }
    static async getOrders(userId, options = {}) {
        const { page = 1, limit = 10, status } = options;
        const skip = (page - 1) * limit;
        const filter = { user: userId };
        if (status) {
            filter.status = status;
        }
        const orders = await Order_1.Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "name email");
        const total = await Order_1.Order.countDocuments(filter);
        return {
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
            },
        };
    }
    static async getOrderById(orderId, userId) {
        const filter = { _id: orderId };
        if (userId) {
            filter.user = userId;
        }
        const order = await Order_1.Order.findOne(filter).populate("user", "name email");
        if (!order) {
            throw (0, errorHandler_1.createError)("Order not found", 404);
        }
        return order;
    }
    static async updateOrderStatus(orderId, status) {
        const order = await Order_1.Order.findById(orderId);
        if (!order) {
            throw (0, errorHandler_1.createError)("Order not found", 404);
        }
        order.status = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note: `Order status updated to ${status}`,
        });
        if (status === index_1.OrderStatus.SHIPPED) {
            order.shippedAt = new Date();
        }
        else if (status === index_1.OrderStatus.DELIVERED) {
            order.deliveredAt = new Date();
        }
        await order.save();
        return order;
    }
    static async updatePaymentStatus(orderId, paymentStatus, transactionId) {
        const order = await Order_1.Order.findById(orderId);
        if (!order) {
            throw (0, errorHandler_1.createError)("Order not found", 404);
        }
        order.paymentStatus = paymentStatus;
        if (transactionId) {
            order.transactionId = transactionId;
        }
        if (paymentStatus === index_1.PaymentStatus.PAID) {
            order.paidAt = new Date();
        }
        await order.save();
        return order;
    }
    static async cancelOrder(orderId, userId, reason) {
        const order = await Order_1.Order.findOne({ _id: orderId, user: userId });
        if (!order) {
            throw (0, errorHandler_1.createError)("Order not found", 404);
        }
        if (order.status === index_1.OrderStatus.SHIPPED ||
            order.status === index_1.OrderStatus.DELIVERED) {
            throw (0, errorHandler_1.createError)("Cannot cancel shipped or delivered order", 400);
        }
        order.status = index_1.OrderStatus.CANCELLED;
        order.cancelledAt = new Date();
        order.cancelReason = reason;
        order.statusHistory.push({
            status: index_1.OrderStatus.CANCELLED,
            timestamp: new Date(),
            note: `Order cancelled: ${reason}`,
        });
        for (const item of order.items) {
            await Product_1.Product.updateOne({ _id: item.product, "variations.sku": item.sku }, { $inc: { "variations.$.stock": item.quantity } });
        }
        await order.save();
        return order;
    }
    static async getOrderStats(userId) {
        const filter = userId ? { user: userId } : {};
        const stats = await Order_1.Order.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$total" },
                },
            },
        ]);
        const totalOrders = await Order_1.Order.countDocuments(filter);
        const totalRevenue = await Order_1.Order.aggregate([
            { $match: { ...filter, paymentStatus: index_1.PaymentStatus.PAID } },
            { $group: { _id: null, total: { $sum: "$total" } } },
        ]);
        return {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            statusBreakdown: stats,
        };
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map