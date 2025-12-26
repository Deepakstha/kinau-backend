import mongoose, { Schema } from "mongoose";
import { IColor } from "../types";

const colorSchema = new Schema<IColor>(
  {
    name: {
      type: String,
      required: [true, "Color name is required"],
      trim: true,
      maxlength: [50, "Color name cannot exceed 50 characters"],
      unique: true,
    },
    hexCode: {
      type: String,
      required: [true, "Hex code is required"],
      trim: true,
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Please enter a valid hex color code",
      ],
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
colorSchema.index({ hexCode: 1 });
colorSchema.index({ isActive: 1 });

export const Color = mongoose.model<IColor>("Color", colorSchema);
