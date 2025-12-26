import { IProductVariant, IUser } from "@/types";
import { OrderStatus, PaymentStatus } from "../enum/index";
import { createError } from "../middlewares/errorHandler";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { ShippingAddress } from "../models/ShippingAddress";
import { CartService } from "./CartService";

export class OrderService {
  static async createOrder(
    userId: IUser,
    orderData: {
      shippingAddressId: string;
      paymentMethod: string;
      notes?: string;
    }
  ) {
    const { shippingAddressId, paymentMethod, notes } = orderData;

    // Get the user's cart
    const cartResult = await CartService.getCart(userId);

    // Handle both possible return types from getCart()
    if (!cartResult) {
      throw createError("Cart not found", 404);
    }
    const cart = "carts" in cartResult ? cartResult.carts[0] : cartResult;

    if (!cart || cart.items.length === 0) {
      throw createError("Cart is empty", 400);
    }
    console.log(" COMMING...")

    // Validate shipping address
    const shippingAddress = await ShippingAddress.findOne({
      _id: shippingAddressId,
      user: userId,
    });

    console.log(shippingAddress, " SHIPPING ADDRESS")
    if (!shippingAddress) {
      throw createError("Shipping address not found", 404);
    }

    // Validate cart items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = cartItem.product as any;
      if (!product.isActive) {
        throw createError(
          `Product ${product.name} is no longer available`,
          400
        );
      }

      console.log(cartItem, " CARTITEM")
      // Find the specific variation
      const variantSku =
        typeof cartItem.variant === "object" && cartItem.variant !== null
          ? (cartItem.variant as any).sku
          : null;

      if (!variantSku) {
        throw createError("Product variation not found", 400);
      }

      const variation = product.variants.find(
        (v: any) => v.sku === variantSku
      );

      if (!variation) {
        throw createError(`Product variation not found`, 400);
      }

      if (variation.stock < cartItem.quantity) {
        throw createError(`Insufficient stock for ${product.name}`, 400);
      }

      const itemTotal = variation.price * cartItem.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku:
          cartItem.variant &&
          typeof cartItem.variant === "object" &&
          "sku" in cartItem.variant
            ? cartItem.variant.sku
            : undefined,
        size:
          cartItem.variant &&
          typeof cartItem.variant === "object" &&
          "size" in cartItem.variant
            ? cartItem.variant.size
            : undefined,
        color:
          cartItem.variant &&
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

    // Calculate shipping and tax (simplified)
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
console.log(shippingAddress, " THIS IS COMMING......")
    // Create order
    const order = new Order({
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
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    await order.save();

    // Update product stock
    for (const cartItem of cart.items) {
      const variant = cartItem.variant as IProductVariant;
      if (!variant?.sku) {
        throw new Error("Variant SKU is required for stock update");
      }

      await Product.updateOne(
        { _id: cartItem.product, "variations.sku": variant.sku },
        { $inc: { "variations.$.stock": -cartItem.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await CartService.emptyCart(userId)

    return order;
  }

 static async getMonthlyOrdersAndSalesByMonths(
  year: number,
  months: number[] // [1,2,3]
) {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year}-12-31`);
  console.log(months, " MONTHS")

  const result = await Order.aggregate([
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


  static async getOrders(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      status?: OrderStatus;
    } = {}
  ) {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const filter: any = { user: userId };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email");

    const total = await Order.countDocuments(filter);

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

  static async getOrderById(orderId: string, userId?: string) {
    const filter: any = { _id: orderId };
    if (userId) {
      filter.user = userId;
    }

    const order = await Order.findOne(filter).populate("user", "name email");
    if (!order) {
      throw createError("Order not found", 404);
    }

    return order;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError("Order not found", 404);
    }

    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: `Order status updated to ${status}`,
    });

    if (status === OrderStatus.SHIPPED) {
      order.shippedAt = new Date();
    } else if (status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }

    await order.save();
    return order;
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    transactionId?: string
  ) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw createError("Order not found", 404);
    }

    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }

    if (paymentStatus === PaymentStatus.PAID) {
      order.paidAt = new Date();
    }

    await order.save();
    return order;
  }

  static async cancelOrder(orderId: string, userId: string, reason: string) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw createError("Order not found", 404);
    }

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw createError("Cannot cancel shipped or delivered order", 400);
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      timestamp: new Date(),
      note: `Order cancelled: ${reason}`,
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, "variations.sku": item.sku },
        { $inc: { "variations.$.stock": item.quantity } }
      );
    }

    await order.save();
    return order;
  }

  static async getOrderStats(userId?: string) {
    const filter = userId ? { user: userId } : {};

    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$total" },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments(filter);
    const totalRevenue = await Order.aggregate([
      { $match: { ...filter, paymentStatus: PaymentStatus.PAID } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats,
    };
  }
}
