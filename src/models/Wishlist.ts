import mongoose, { Schema } from "mongoose";
import { IWishlist, IWishlistItem } from "../types";

const wishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ "items.product": 1 });

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
