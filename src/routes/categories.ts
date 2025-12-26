import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authenticate, authorize, optionalAuth } from "../middlewares/auth";
import { handleValidationErrors } from "../middlewares/validation";
import { uploadSingle } from "../utils/upload";
import {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
} from "../validators/category";

const router = Router();

// Public routes with optional authentication
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", optionalAuth, CategoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/tree:
 *   get:
 *     summary: Get category tree
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a category tree
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/tree", optionalAuth, CategoryController.getCategoryTree);

/**
 * @swagger
 * /api/categories/slug/{slug}:
 *   get:
 *     summary: Get category by slug
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug of the category
 *     responses:
 *       200:
 *         description: Returns a category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.get("/slug/:slug", optionalAuth, CategoryController.getCategoryBySlug);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Returns a category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.get(
  "/:id",
  optionalAuth,
  categoryIdValidation,
  handleValidationErrors,
  CategoryController.getCategoryById
);

// Admin only routes
/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.use(authenticate, authorize("admin"));
router.post(
  "/",
  uploadSingle("image"),
  createCategoryValidation,
  handleValidationErrors,
  CategoryController.createCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */
router.put(
  "/:id",
  uploadSingle("image"),
  updateCategoryValidation,
  handleValidationErrors,
  CategoryController.updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete(
  "/:id",
  categoryIdValidation,
  handleValidationErrors,
  CategoryController.deleteCategory
);

/**
 * @swagger
 * /api/categories/{id}/toggle-status:
 *   patch:
 *     summary: Toggle category status
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category status toggled successfully
 */
router.patch(
  "/:id/toggle-status",
  categoryIdValidation,
  handleValidationErrors,
  CategoryController.toggleCategoryStatus
);

export default router;
