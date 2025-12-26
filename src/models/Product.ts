import mongoose, { Schema, Types } from "mongoose";
import slugify from "slugify";
import { IProduct, IProductVariant } from "../types";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: false, // Simple boolean, not array
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
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "ProductVariant",
      },
    ],
    mainImages: {
      type: [String],
      validate: {
        validator: function (images: string[]) {
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
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ variants: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });

// Generate slug before saving
productSchema.pre("save", async function (next) {
  try {
    if (this.isModified("name")) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Virtual for total stock (calculated from variants)
productSchema.virtual("totalStock").get(function () {
  // This will be populated when variants are populated
  const product = this as unknown as IProduct & { variants: IProductVariant[] };

  if (!product.variants || !Array.isArray(product.variants)) return 0;

  // Check if variants are populated (have stock property) or just ObjectId references
  const firstVariant = product.variants[0];
  if (!firstVariant) return 0;

  const isPopulated =
    typeof firstVariant === "object" && "stock" in firstVariant;

  if (!isPopulated) {
    // If variants are not populated, we can't calculate stock
    return 0;
  }

  return product.variants.reduce((total, variant) => {
    return total + (variant.stock || 0);
  }, 0);
});

// Virtual for price range (calculated from variants)
productSchema.virtual("priceRange").get(function (this: IProduct) {
  // If no variants or variants array is empty, return base price
  if (
    !this.variants ||
    !Array.isArray(this.variants) ||
    this.variants.length === 0
  ) {
    return { min: this.basePrice, max: this.basePrice };
  }

  // Check if variants are populated (have price property) or just ObjectId references
  const firstVariant = this.variants[0];
  const isPopulated =
    firstVariant && typeof firstVariant === "object" && "price" in firstVariant;

  if (!isPopulated) {
    // If variants are not populated, return base price as fallback
    return { min: this.basePrice, max: this.basePrice };
  }

  // If variants are populated, calculate price range from variants
  const prices = this.variants.map((v: any) => v.discountPrice || v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
});

// Ensure virtual fields are included in JSON
productSchema.set("toJSON", { virtuals: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);
