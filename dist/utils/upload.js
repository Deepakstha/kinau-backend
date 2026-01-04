"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = exports.validateImage = exports.deleteFromCloudinary = exports.uploadMultipleToCloudinary = exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../config/cloudinary");
const errorHandler_1 = require("../middlewares/errorHandler");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10,
    },
});
const uploadToCloudinary = async (file, folder = "ecommerce") => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary_1.cloudinary.uploader
                .upload_stream({
                folder,
                resource_type: "image",
                transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else if (result) {
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        bytes: result.bytes,
                    });
                }
                else {
                    reject(new Error("Upload failed"));
                }
            })
                .end(file.buffer);
        });
    }
    catch (error) {
        throw (0, errorHandler_1.createError)("Failed to upload image", 500);
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
const uploadMultipleToCloudinary = async (files, folder = "ecommerce") => {
    try {
        const uploadPromises = files.map((file) => (0, exports.uploadToCloudinary)(file, folder));
        return await Promise.all(uploadPromises);
    }
    catch (error) {
        throw (0, errorHandler_1.createError)("Failed to upload images", 500);
    }
};
exports.uploadMultipleToCloudinary = uploadMultipleToCloudinary;
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary_1.cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        throw (0, errorHandler_1.createError)("Failed to delete image", 500);
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
const validateImage = (file) => {
    if (file.size > 5 * 1024 * 1024) {
        throw (0, errorHandler_1.createError)("File size too large. Maximum 5MB allowed", 400);
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
        throw (0, errorHandler_1.createError)("Invalid file type. Only JPEG, PNG, and WebP are allowed", 400);
    }
    return true;
};
exports.validateImage = validateImage;
const uploadSingle = (fieldName) => exports.upload.single(fieldName);
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fieldName, maxCount = 10) => exports.upload.array(fieldName, maxCount);
exports.uploadMultiple = uploadMultiple;
const uploadFields = (fields) => exports.upload.fields(fields);
exports.uploadFields = uploadFields;
//# sourceMappingURL=upload.js.map