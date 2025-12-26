import mongoose, { Schema } from "mongoose";
import { ICart, ICartItem } from "../types";

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: false, // Optional - for products with variants
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
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
cartSchema.index({ user: 1 });
cartSchema.index({ "items.product": 1 });
cartSchema.index({ "items.variant": 1 });

// Calculate total amount before saving
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
