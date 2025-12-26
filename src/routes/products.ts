import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authenticate, authorize, optionalAuth } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { uploadFields } from "../utils/upload";
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  productQueryValidation,
} from "../validators/product";

const router = Router();

// Public routes with optional authentication
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Category ID for filtering
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search query for product names
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get(
  "/",
  optionalAuth,
  productQueryValidation,
  handleValidationErrors,
  ProductController.getAllProducts
);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of featured products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/featured", optionalAuth, ProductController.getFeaturedProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for product names
 *     responses:
 *       200:
 *         description: List of products matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/search", optionalAuth, ProductController.searchProducts);

/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/slug/:slug", optionalAuth, ProductController.getProductBySlug);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get(
  "/:id",
  optionalAuth,
  productIdValidation,
  handleValidationErrors,
  ProductController.getProductById
);

/**
 * @swagger
 * /api/products/{id}/related:
 *   get:
 *     summary: Get related products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of related products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get(
  "/:id/related",
  optionalAuth,
  productIdValidation,
  handleValidationErrors,
  ProductController.getRelatedProducts
);

// Admin only routes
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - basePrice
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               description:
 *                 type: string
 *                 description: Detailed description of the product
 *               shortDescription:
 *                 type: string
 *                 description: Short description of the product (optional)
 *               category:
 *                 type: string
 *                 description: ID of the category this product belongs to
 *               brand:
 *                 type: string
 *                 description: Brand of the product (optional)
 *               basePrice:
 *                 type: number
 *                 description: Base price of the product
 *               weight:
 *                 type: number
 *                 description: Weight of the product in grams (optional)
 *               'dimensions[length]':
 *                 type: number
 *                 description: Length of the product in cm (optional)
 *               'dimensions[width]':
 *                 type: number
 *                 description: Width of the product in cm (optional)
 *               'dimensions[height]':
 *                 type: number
 *                 description: Height of the product in cm (optional)
 *               tags:
 *                 type: string
 *                 description: Comma-separated list of tags (optional)
 *               seoTitle:
 *                 type: string
 *                 description: SEO title for the product (optional, max 60 chars)
 *               seoDescription:
 *                 type: string
 *                 description: SEO description for the product (optional, max 160 chars)
 *               mainImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Main product images (max 5)
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadFields([{ name: "mainImages", maxCount: 5 }]),
  createProductValidation,
  handleValidationErrors,
  ProductController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.put(
  "/:id",
  uploadFields([{ name: "mainImages", maxCount: 5 }]),
  updateProductValidation,
  handleValidationErrors,
  ProductController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete(
  "/:id",
  productIdValidation,
  handleValidationErrors,
  ProductController.deleteProduct
);

/**
 * @swagger
 * /api/products/{id}/toggle-status:
 *   patch:
 *     summary: Toggle product status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product status toggled successfully
 */
router.patch(
  "/:id/toggle-status",
  productIdValidation,
  handleValidationErrors,
  ProductController.toggleProductStatus
);

/**
 * @swagger
 * /api/products/{id}/toggle-featured:
 *   patch:
 *     summary: Toggle product featured status
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product featured status toggled successfully
 */
router.patch(
  "/:id/toggle-featured",
  productIdValidation,
  handleValidationErrors,
  ProductController.toggleFeaturedStatus
);

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Update product stock
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product stock updated successfully
 */
router.patch(
  "/:id/stock",
  productIdValidation,
  handleValidationErrors,
  ProductController.updateStock
);

export default router;
