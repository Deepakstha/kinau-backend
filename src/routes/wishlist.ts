import { Router } from "express";
import { WishlistController } from "../controllers/WishlistController";
import { authenticate } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { param } from "express-validator";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Validation middleware
const productIdValidation = [
  param("productId")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID"),
];

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: User wishlist management
 */

/**
 * @swagger
 * /api/wishlists:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *                 message:
 *                   type: string
 *                   example: "Wishlist retrieved successfully"
 */
router.get("/", WishlistController.getWishlist);

/**
 * @swagger
 * /api/wishlists/count:
 *   get:
 *     summary: Get number of items in wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: number
 *                       example: 5
 *                 message:
 *                   type: string
 *                   example: "Wishlist count retrieved successfully"
 */
router.get("/count", WishlistController.getWishlistCount);

/**
 * @swagger
 * /api/wishlists/check/{productId}:
 *   get:
 *     summary: Check if product is in wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to check
 *     responses:
 *       200:
 *         description: Wishlist status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isInWishlist:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: "Wishlist status checked successfully"
 */
router.get(
  "/check/:productId",
  productIdValidation,
  handleValidationErrors,
  WishlistController.checkWishlistStatus
);

/**
 * @swagger
 * /api/wishlists:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *                 example: "60d5ec9f8b3f8b2b2c1b3f5d"
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *                 message:
 *                   type: string
 *                   example: "Product added to wishlist successfully"
 */
router.post("/", WishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlists/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
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
 *         description: Product removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *                 message:
 *                   type: string
 *                   example: "Product removed from wishlist successfully"
 */
router.delete(
  "/remove/:productId",
  productIdValidation,
  handleValidationErrors,
  WishlistController.removeFromWishlist
);

/**
 * @swagger
 * /api/wishlists/clear:
 *   delete:
 *     summary: Clear all items from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Wishlist'
 *                 message:
 *                   type: string
 *                   example: "Wishlist cleared successfully"
 */
router.delete("/clear", WishlistController.clearWishlist);

/**
 * @swagger
 * /api/wishlists/move-to-cart/{productId}:
 *   post:
 *     summary: Move product from wishlist to cart
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to move to cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               size:
 *                 type: string
 *                 description: Size of the product
 *                 example: "M"
 *               color:
 *                 type: string
 *                 description: Color of the product
 *                 example: "Black"
 *               sku:
 *                 type: string
 *                 description: SKU of the product variant
 *                 example: "TSHIRT-BLK-M"
 *     responses:
 *       200:
 *         description: Product moved to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     wishlist:
 *                       $ref: '#/components/schemas/Wishlist'
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: "Product moved to cart successfully"
 */
router.post(
  "/move-to-cart/:productId",
  productIdValidation,
  handleValidationErrors,
  WishlistController.moveToCart
);

export default router;
