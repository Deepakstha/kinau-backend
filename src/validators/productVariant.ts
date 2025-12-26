import { body, param, query } from "express-validator";

export const createProductVariantValidation = [
  param("productId").isMongoId().withMessage("Product ID must be valid"),
  body("size").isMongoId().withMessage("Size must be a valid ID"),
  body("color").isMongoId().withMessage("Color must be a valid ID"),
  body("sku")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters")
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage(
      "SKU can only contain uppercase letters, numbers, hyphens, and underscores"
    ),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number")
    .custom((value, { req }) => {
      if (value && req.body.price && value >= req.body.price) {
        throw new Error("Discount price must be less than regular price");
      }
      return true;
    }),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("images")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Variant can have maximum 10 images"),
  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const updateProductVariantValidation = [
  param("variantId").isMongoId().withMessage("Variant ID must be valid"),
  body("size").optional().isMongoId().withMessage("Size must be a valid ID"),
  body("color").optional().isMongoId().withMessage("Color must be a valid ID"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters")
    .matches(/^[A-Z0-9-_]+$/)
    .withMessage(
      "SKU can only contain uppercase letters, numbers, hyphens, and underscores"
    ),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("images")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Variant can have maximum 10 images"),
  body("images.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const productVariantIdValidation = [
  param("variantId").isMongoId().withMessage("Variant ID must be valid"),
];

export const productIdValidation = [
  param("productId").isMongoId().withMessage("Product ID must be valid"),
];

export const updateStockValidation = [
  param("variantId").isMongoId().withMessage("Variant ID must be valid"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

export const toggleStatusValidation = [
  param("variantId").isMongoId().withMessage("Variant ID must be valid"),
];

export const productVariantQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("size").optional().isMongoId().withMessage("Size must be a valid ID"),
  query("color").optional().isMongoId().withMessage("Color must be a valid ID"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number"),
  query("inStock")
    .optional()
    .isBoolean()
    .withMessage("inStock must be a boolean value"),
  query("active")
    .optional()
    .isBoolean()
    .withMessage("active must be a boolean value"),
];
