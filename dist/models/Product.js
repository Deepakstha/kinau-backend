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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
        type: String,
        maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
    brand: {
        type: String,
        trim: true,
        maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    basePrice: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Base price cannot be negative"],
    },
    variants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ProductVariant",
        },
    ],
    mainImages: {
        type: [String],
        validate: {
            validator: function (images) {
                return images.length <= 5;
            },
            message: "Product can have maximum 5 images",
        },
    },
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: true,
    },
    isWeeklyDeals: {
        type: Boolean,
        default: true,
    },
    isBestSeller: {
        type: Boolean,
        default: true,
    },
    weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
    },
    dimensions: {
        length: {
            type: Number,
            min: [0, "Length cannot be negative"],
        },
        width: {
            type: Number,
            min: [0, "Width cannot be negative"],
        },
        height: {
            type: Number,
            min: [0, "Height cannot be negative"],
        },
    },
    seoTitle: {
        type: String,
        maxlength: [60, "SEO title cannot exceed 60 characters"],
    },
    seoDescription: {
        type: String,
        maxlength: [160, "SEO description cannot exceed 160 characters"],
    },
}, {
    timestamps: true,
});
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ variants: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.pre("save", async function (next) {
    try {
        if (this.isModified("name")) {
            this.slug = (0, slugify_1.default)(this.name, {
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g,
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
productSchema.virtual("totalStock").get(function () {
    const product = this;
    if (!product.variants || !Array.isArray(product.variants))
        return 0;
    const firstVariant = product.variants[0];
    if (!firstVariant)
        return 0;
    const isPopulated = typeof firstVariant === "object" && "stock" in firstVariant;
    if (!isPopulated) {
        return 0;
    }
    return product.variants.reduce((total, variant) => {
        return total + (variant.stock || 0);
    }, 0);
});
productSchema.virtual("priceRange").get(function () {
    if (!this.variants ||
        !Array.isArray(this.variants) ||
        this.variants.length === 0) {
        return { min: this.basePrice, max: this.basePrice };
    }
    const firstVariant = this.variants[0];
    const isPopulated = firstVariant && typeof firstVariant === "object" && "price" in firstVariant;
    if (!isPopulated) {
        return { min: this.basePrice, max: this.basePrice };
    }
    const prices = this.variants.map((v) => v.discountPrice || v.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
});
productSchema.set("toJSON", { virtuals: true });
exports.Product = mongoose_1.default.model("Product", productSchema);
//# sourceMappingURL=Product.js.map