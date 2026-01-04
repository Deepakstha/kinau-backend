"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
exports.getAllRegisteredRoutes = getAllRegisteredRoutes;
const routeUtils_1 = require("./routeUtils");
const routeRegistry = [];
const routeExamples = {
    "POST /cart/add": {
        totalAmount: 199.98,
        items: [
            {
                product: "64d5f7a5c4b3e1f5c8d9e0f1",
                variant: "64d5f7a5c4b3e1f5c8d9e0f2",
                quantity: 2,
                price: 99.99,
            },
        ],
    },
    "PUT /cart/update": {
        totalAmount: 249.97,
        items: [
            {
                product: "64d5f7a5c4b3e1f5c8d9e0f1",
                variant: "64d5f7a5c4b3e1f5c8d9e0f2",
                quantity: 3,
                price: 99.99,
            },
        ],
    },
    "POST /auth/register": {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePassword123!",
        confirmPassword: "SecurePassword123!",
    },
    "POST /auth/login": {
        email: "john@example.com",
        password: "SecurePassword123!",
    },
    "POST /orders": {
        shippingAddressId: "64d5f7a5c4b3e1f5c8d9e0f3",
        paymentMethod: "credit_card",
        items: [
            {
                product: "64d5f7a5c4b3e1f5c8d9e0f1",
                variant: "64d5f7a5c4b3e1f5c8d9e0f2",
                quantity: 2,
                price: 99.99,
            },
        ],
    },
};
function registerRoutes(path, router, name, examples) {
    routeRegistry.push({ path, router, name, examples });
    return router;
}
function getAllRegisteredRoutes() {
    return routeRegistry.map(({ path, router, name, examples }) => {
        const routes = (0, routeUtils_1.getAllRoutes)(router);
        const routesWithExamples = routes.map((route) => ({
            ...route,
            example: routeExamples[`${route.method} ${route.path}`] || null,
        }));
        return {
            name,
            basePath: path,
            routes: routesWithExamples,
        };
    });
}
//# sourceMappingURL=routeRegistry.js.map