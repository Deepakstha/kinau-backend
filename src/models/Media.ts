import mongoose, { Schema } from "mongoose";
import { IMedia } from "../types";

const mediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, "Original name is required"],
      trim: true,
    },
    mimetype: {
      type: String,
      required: [true, "MIME type is required"],
    },
    size: {
      type: Number,
      required: [true, "File size is required"],
      min: [0, "File size cannot be negative"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
    },
    cloudinaryId: {
      type: String,
      required: [true, "Cloudinary ID is required"],
      unique: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploaded by user is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
mediaSchema.index({ cloudinaryId: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ mimetype: 1 });

export const Media = mongoose.model<IMedia>("Media", mediaSchema);
