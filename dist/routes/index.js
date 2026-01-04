"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const response_1 = require("../utils/response");
const routeRegistry_1 = require("../utils/routeRegistry");
const auth_1 = __importDefault(require("./auth"));
const cart_1 = __importDefault(require("./cart"));
const categories_1 = __importDefault(require("./categories"));
const colors_1 = __importDefault(require("./colors"));
const orders_1 = __importDefault(require("./orders"));
const products_1 = __importDefault(require("./products"));
const productVariants_1 = __importDefault(require("./productVariants"));
const shipping_addresses_1 = __importDefault(require("./shipping-addresses"));
const sizes_1 = __importDefault(require("./sizes"));
const wishlist_1 = __importDefault(require("./wishlist"));
const router = (0, express_1.Router)();
router.get("/health", (req, res) => {
    return response_1.ResponseUtil.success(res, { status: "OK", timestamp: new Date() }, "Service is healthy" + req.ip);
});
router.get("/ip", (req, res) => {
    return response_1.ResponseUtil.success(res, req.ip, "IP Address");
});
router.use("/auth", auth_1.default);
router.use("/categories", categories_1.default);
router.use("/products", products_1.default);
router.use("/product-variants", productVariants_1.default);
router.use("/carts", cart_1.default);
router.use("/wishlists", wishlist_1.default);
router.use("/orders", orders_1.default);
router.use("/shipping-addresses", shipping_addresses_1.default);
router.use("/sizes", sizes_1.default);
router.use("/colors", colors_1.default);
router.get("/routes", (req, res) => {
    return response_1.ResponseUtil.success(res, {
        status: "OK",
        timestamp: new Date(),
        routes: (0, routeRegistry_1.getAllRegisteredRoutes)(),
    }, "All registered routes");
});
exports.default = router;
//# sourceMappingURL=index.js.map