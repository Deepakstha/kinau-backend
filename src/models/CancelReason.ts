import mongoose, { Schema } from "mongoose";
import { ICancelReason } from "../types";

const cancelReasonSchema = new Schema<ICancelReason>(
  {
    reason: {
      type: String,
      required: [true, "Cancel reason is required"],
      trim: true,
      maxlength: [200, "Reason cannot exceed 200 characters"],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
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
cancelReasonSchema.index({ isActive: 1 });

export const CancelReason = mongoose.model<ICancelReason>(
  "CancelReason",
  cancelReasonSchema
);
