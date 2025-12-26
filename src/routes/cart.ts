import { Router } from "express";
import { CartController } from "../controllers/CartController";
import { authenticate } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { body, param } from "express-validator";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           description: ID of the product
 *           example: 64d5f7a5c4b3e1f5c8d9e0f1
 *         variant:
 *           type: string
 *           description: ID of the product variant (if applicable)
 *           example: 64d5f7a5c4b3e1f5c8d9e0f2
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the product
 *           example: 2
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Price per unit
 *           example: 99.99
 */

// Cart validation middleware
const addToCartValidation = [
  body("totalAmount")
    .isNumeric()
    .withMessage("Total amount must be a number")
    .isFloat({ min: 0 })
    .withMessage("Total amount cannot be negative"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),
  body("items.*.product").isMongoId().withMessage("Product ID must be valid"),
  body("items.*.variant")
    .optional()
    .isMongoId()
    .withMessage("Variant ID must be valid"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),
];

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 */
router.get("/", CartController.getCart);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d5f7a5c4b3e1f5c8d9e0f1
 *                     user:
 *                       type: string
 *                       example: 60d5f7a5c4b3e1f5c8d9e0f2
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 *                     totalAmount:
 *                       type: number
 *                       example: 199.98
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.get("/", CartController.getCart);

/**
 * @swagger
 * /api/carts/add:
 *   post:
 *     summary: Add items to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalAmount
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CartItem'
 *               totalAmount:
 *                 type: number
 *                 example: 199.98
 *     responses:
 *       200:
 *         description: Items added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/add",
  addToCartValidation,
  handleValidationErrors,
  CartController.addToCart
);

/**
 * @swagger
 * /api/carts/update:
 *   put:
 *     summary: Update cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalAmount
 *             properties:
 *               totalAmount:
 *                 type: number
 *                 example: 249.97
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       400:
 *         description: Invalid input data
 */
router.put(
  "/update",
  [
    ...addToCartValidation,
    body("items.*.quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be non-negative"),
  ],
  handleValidationErrors,
  CartController.updateCartItem
);

/**
 * @swagger
 * /api/carts/remove/{productId}/{variantId}:
 *   delete:
 *     summary: Remove item from cart (with variant)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the variant to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found in cart
 */
router.delete(
  "/remove/:productId/:variantId",
  [
    param("productId").isMongoId().withMessage("Product ID must be valid"),
    param("variantId").isMongoId().withMessage("Variant ID must be valid"),
  ],
  handleValidationErrors,
  CartController.removeFromCart
);

/**
 * @swagger
 * /api/carts/remove/{productId}:
 *   delete:
 *     summary: Remove item from cart (without variant)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found in cart
 */
router.delete(
  "/remove/:productId",
  [param("productId").isMongoId().withMessage("Product ID must be valid")],
  handleValidationErrors,
  CartController.removeFromCartWithoutVariant
);

/**
 * @swagger
 * /api/carts/clear:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/clear", CartController.clearCart);

/**
 * @swagger
 * /api/carts/summary:
 *   get:
 *     summary: Get carts summary
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns cart summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     itemCount:
 *                       type: number
 *                       description: Total number of items in cart
 *                     subTotal:
 *                       type: number
 *                       description: Total amount of all items
 *                     items:
 *                       type: integer
 *                       description: Number of unique items in cart
 */
router.get("/summary", CartController.getCartSummary);

/**
 * @swagger
 * /api/carts/validate:
 *   get:
 *     summary: Validate cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart is valid
 *       400:
 *         description: Cart is invalid
 */
router.get("/validate", CartController.validateCart);

export default router;
