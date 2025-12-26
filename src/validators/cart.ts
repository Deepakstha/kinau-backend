import { body, param } from "express-validator";

export const addToCartValidation = [
  body("product").isMongoId().withMessage("Product must be a valid ID"),
  body("variant")
    .optional()
    .isMongoId()
    .withMessage("Variant must be a valid ID"),
  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
];

export const updateCartItemValidation = [
  body("product").isMongoId().withMessage("Product must be a valid ID"),
  body("variant")
    .optional()
    .isMongoId()
    .withMessage("Variant must be a valid ID"),
  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be between 1 and 100"),
];

export const removeFromCartValidation = [
  body("product").isMongoId().withMessage("Product must be a valid ID"),
  body("variant")
    .optional()
    .isMongoId()
    .withMessage("Variant must be a valid ID"),
];

export const moveToWishlistValidation = [
  body("product").isMongoId().withMessage("Product must be a valid ID"),
  body("variant")
    .optional()
    .isMongoId()
    .withMessage("Variant must be a valid ID"),
];
