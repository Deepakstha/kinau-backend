import { Router } from "express";
import { ProductVariantController } from "../controllers/ProductVariantController";
import { authenticate, authorize, optionalAuth } from "../middlewares/auth";
import { upload } from "../utils/upload";
import { validateProductVariant } from "../middlewares/validation";

const router = Router();

// Public routes (with optional auth for admin visibility)
/**
 * @swagger
 * /api/product-variants/product/{productId}:
 *   get:
 *     summary: Get product variants by product ID
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of product variants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 */
router.get(
  "/product/:productId",
  optionalAuth,
  ProductVariantController.getVariantsByProduct
);

/**
 * @swagger
 * /api/product-variants/{variantId}:
 *   get:
 *     summary: Get product variant by ID
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 */
router.get(
  "/:variantId",
  optionalAuth,
  ProductVariantController.getVariantById
);

/**
 * @swagger
 * /api/product-variants/product/{productId}:
 *   post:
 *     summary: Create a new product variant
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       201:
 *         description: Product variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 */
router.post(
  "/product/:productId",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  validateProductVariant,
  ProductVariantController.createVariant
);

/**
 * @swagger
 * /api/product-variants/{variantId}:
 *   put:
 *     summary: Update a product variant
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Product variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 */
router.put(
  "/:variantId",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  validateProductVariant,
  ProductVariantController.updateVariant
);

/**
 * @swagger
 * /api/product-variants/{variantId}:
 *   delete:
 *     summary: Delete a product variant
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant deleted successfully
 */
router.delete(
  "/:variantId",
  authenticate,
  authorize("admin"),
  ProductVariantController.deleteVariant
);

/**
 * @swagger
 * /api/product-variants/{variantId}/toggle-status:
 *   patch:
 *     summary: Toggle product variant status
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant status toggled successfully
 */
router.patch(
  "/:variantId/toggle-status",
  authenticate,
  authorize("admin"),
  ProductVariantController.toggleVariantStatus
);

/**
 * @swagger
 * /api/product-variants/{variantId}/stock:
 *   patch:
 *     summary: Update product variant stock
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Product variant stock updated successfully
 */
router.patch(
  "/:variantId/stock",
  authenticate,
  authorize("admin"),
  ProductVariantController.updateStock
);

export default router;
