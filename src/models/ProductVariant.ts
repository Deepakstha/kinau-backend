import mongoose, { Schema } from "mongoose";
import { IProductVariant } from "../types";

const productVariantSchema = new Schema<IProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
      required: [true, "Size is required"],
    },
    color: {
      type: Schema.Types.ObjectId,
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
        validator: function (this: IProductVariant, value: number) {
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
      required: false, // Optional multiple images per variant
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
productVariantSchema.index({ product: 1 });
productVariantSchema.index({ sku: 1 });
productVariantSchema.index({ size: 1 });
productVariantSchema.index({ color: 1 });
productVariantSchema.index({ isActive: 1 });
productVariantSchema.index({ product: 1, size: 1, color: 1 }, { unique: true });

export const ProductVariant = mongoose.model<IProductVariant>(
  "ProductVariant",
  productVariantSchema
);
