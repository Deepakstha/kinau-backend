// src/utils/routeRegistry.ts
import { Router } from "express";
import { getAllRoutes } from "./routeUtils";

interface RouteExample {
  method: string;
  path: string;
  body?: any;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

interface RouteInfo {
  path: string;
  router: Router;
  name: string;
  examples?: RouteExample[];
}

const routeRegistry: RouteInfo[] = [];

// Example request bodies for different routes
const routeExamples: Record<string, any> = {
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

export function registerRoutes(
  path: string,
  router: Router,
  name: string,
  examples?: RouteExample[]
) {
  routeRegistry.push({ path, router, name, examples });
  return router;
}

export function getAllRegisteredRoutes() {
  return routeRegistry.map(({ path, router, name, examples }) => {
    const routes = getAllRoutes(router);

    // Add examples to routes if available
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
