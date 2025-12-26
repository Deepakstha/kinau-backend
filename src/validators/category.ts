import { body, param } from "express-validator";

export const createCategoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Parent category must be a valid ID"),
];

export const updateCategoryValidation = [
  param("id").isMongoId().withMessage("Category ID must be valid"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("parentCategory")
    .optional()
    .isMongoId()
    .withMessage("Parent category must be a valid ID"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const categoryIdValidation = [
  param("id").isMongoId().withMessage("Category ID must be valid"),
];
