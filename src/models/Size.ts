import mongoose, { Schema } from "mongoose";
import { ISize } from "../types";

const sizeSchema = new Schema<ISize>(
  {
    name: {
      type: String,
      required: [true, "Size name is required"],
      trim: true,
      maxlength: [50, "Size name cannot exceed 50 characters"],
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Size code is required"],
      trim: true,
      uppercase: true,
      maxlength: [10, "Size code cannot exceed 10 characters"],
      unique: true,
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
sizeSchema.index({ code: 1 });
sizeSchema.index({ isActive: 1 });

export const Size = mongoose.model<ISize>("Size", sizeSchema);
