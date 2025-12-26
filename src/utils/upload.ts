import multer from "multer";
import { Request } from "express";
import { cloudinary } from "../config/cloudinary";
import { MulterFile, CloudinaryUploadResult } from "../types";
import { createError } from "../middlewares/errorHandler";

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (
  req: Request,
  file: MulterFile,
  cb: multer.FileFilterCallback
) => {
  // Check file type
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
});

// Upload single image to Cloudinary
export const uploadToCloudinary = async (
  file: MulterFile,
  folder: string = "ecommerce"
): Promise<CloudinaryUploadResult> => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
              });
            } else {
              reject(new Error("Upload failed"));
            }
          }
        )
        .end(file.buffer);
    });
  } catch (error) {
    throw createError("Failed to upload image", 500);
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (
  files: MulterFile[],
  folder: string = "ecommerce"
): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw createError("Failed to upload images", 500);
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw createError("Failed to delete image", 500);
  }
};

// Validate image dimensions and size
export const validateImage = (file: MulterFile): boolean => {
  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    throw createError("File size too large. Maximum 5MB allowed", 400);
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    throw createError(
      "Invalid file type. Only JPEG, PNG, and WebP are allowed",
      400
    );
  }

  return true;
};

// Middleware for single image upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Middleware for multiple image upload
export const uploadMultiple = (fieldName: string, maxCount: number = 10) =>
  upload.array(fieldName, maxCount);

// Middleware for mixed upload (different field names)
export const uploadFields = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields);
