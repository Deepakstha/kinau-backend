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
exports.ProductVariant = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productVariantSchema = new mongoose_1.Schema({
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
    },
    size: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Size",
        required: [true, "Size is required"],
    },
    color: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Color",
        required: [true, "Color is required"],
    },
    sku: {
        type: String,
        required: [true, "SKU is required"],
        unique: true,
        trim: true,
        uppercase: true,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    discountPrice: {
        type: Number,
        min: [0, "Discount price cannot be negative"],
        validate: {
            validator: function (value) {
                return !value || value < this.price;
            },
            message: "Discount price must be less than regular price",
        },
    },
    stock: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock cannot be negative"],
        default: 0,
    },
    image: {
        type: String,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
productVariantSchema.index({ product: 1 });
productVariantSchema.index({ sku: 1 });
productVariantSchema.index({ size: 1 });
productVariantSchema.index({ color: 1 });
productVariantSchema.index({ isActive: 1 });
productVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });
exports.ProductVariant = mongoose_1.default.model("ProductVariant", productVariantSchema);
//# sourceMappingURL=ProductVariant.js.map