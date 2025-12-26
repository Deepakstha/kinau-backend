import { Router } from "express";
import { ResponseUtil } from "../utils/response";
import { getAllRegisteredRoutes } from "../utils/routeRegistry";
import authRoutes from "./auth";
import cartRoutes from "./cart";
import categoryRoutes from "./categories";
import colorRoutes from "./colors";
import orderRoutes from "./orders";
import productRoutes from "./products";
import productVariantRoutes from "./productVariants";
import shippingAddressRoutes from "./shipping-addresses";
import sizeRoutes from "./sizes";
import wishlistRoutes from "./wishlist";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  return ResponseUtil.success(
    res,
    { status: "OK", timestamp: new Date() },
    "Service is healthy" + req.ip
  );
});

router.get("/ip", (req, res) => {
  return ResponseUtil.success(res, req.ip, "IP Address");
});

// API routes
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/product-variants", productVariantRoutes);
router.use("/carts", cartRoutes);
router.use("/wishlists", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/shipping-addresses", shippingAddressRoutes);
router.use("/sizes", sizeRoutes);
router.use("/colors", colorRoutes);

router.get("/routes", (req, res) => {
  return ResponseUtil.success(
    res,
    {
      status: "OK",
      timestamp: new Date(),
      routes: getAllRegisteredRoutes(),
    },
    "All registered routes"
  );
});

export default router;
