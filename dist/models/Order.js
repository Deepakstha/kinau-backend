"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderItemSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
    },
    variant: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: false,
    },
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
    },
    sku: {
        type: String,
        trim: true,
    },
    size: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Size",
        required: false,
    },
    color: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Color",
        required: false,
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    total: {
        type: Number,
        required: [true, "Total is required"],
        min: [0, "Total cannot be negative"],
    },
    image: {
        type: String,
        trim: true,
    },
}, { _id: false });
const statusHistorySchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ],
        required: [true, "Status is required"],
    },
    timestamp: {
        type: Date,
        required: [true, "Timestamp is required"],
        default: Date.now,
    },
    note: {
        type: String,
        trim: true,
    },
}, { _id: false });
const orderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String,
        required: [true, "Order number is required"],
        unique: true,
        uppercase: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    items: [orderItemSchema],
    shippingAddress: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        company: String,
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
    },
    billingAddress: {
        firstName: String,
        lastName: String,
        company: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String,
    },
    subtotal: {
        type: Number,
        required: [true, "Subtotal is required"],
        min: [0, "Subtotal cannot be negative"],
    },
    shippingCost: {
        type: Number,
        required: [true, "Shipping cost is required"],
        min: [0, "Shipping cost cannot be negative"],
        default: 0,
    },
    tax: {
        type: Number,
        required: [true, "Tax is required"],
        min: [0, "Tax cannot be negative"],
        default: 0,
    },
    total: {
        type: Number,
        required: [true, "Total is required"],
        min: [0, "Total cannot be negative"],
    },
    status: {
        type: String,
        enum: [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
    },
    transactionId: {
        type: String,
        trim: true,
    },
    statusHistory: {
        type: [statusHistorySchema],
        default: [],
    },
    trackingNumber: {
        type: String,
        trim: true,
    },
    shippedAt: {
        type: Date,
    },
    deliveredAt: {
        type: Date,
    },
    paidAt: {
        type: Date,
    },
    cancelReason: {
        type: String,
        trim: true,
    },
    cancelledAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.pre("validate", function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
        this.orderNumber = `ORD${timestamp}${random}`;
    }
    next();
});
orderSchema.pre("save", function (next) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.total = this.subtotal + this.shippingCost + this.tax;
    next();
});
exports.Order = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=Order.js.map