import { body, param, query } from "express-validator";

export const createProductValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Short description cannot exceed 500 characters"),
  body("category").isMongoId().withMessage("Category must be a valid ID"),
  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),
  body("basePrice")
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),
  body("mainImages")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Product can have maximum 5 main images"),
  body("mainImages.*")
    .optional()
    .isURL()
    .withMessage("Each image must be a valid URL"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be between 1 and 50 characters"),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("dimensions.length")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Length must be a positive number"),
  body("dimensions.width")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Width must be a positive number"),
  body("dimensions.height")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Height must be a positive number"),
  body("seoTitle")
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage("SEO title cannot exceed 60 characters"),
  body("seoDescription")
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage("SEO description cannot exceed 160 characters"),
];

export const updateProductValidation = [
  param("id").isMongoId().withMessage("Product ID must be valid"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  body("basePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Base price must be a positive number"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),
];

export const productIdValidation = [
  param("id").isMongoId().withMessage("Product ID must be valid"),
];

export const productQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("category")
    .optional()
    .isMongoId()
    .withMessage("Category must be a valid ID"),
  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a positive number"),
  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a positive number"),
  query("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean value"),
];
