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
exports.Media = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mediaSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
mediaSchema.index({ cloudinaryId: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ mimetype: 1 });
exports.Media = mongoose_1.default.model("Media", mediaSchema);
//# sourceMappingURL=Media.js.map