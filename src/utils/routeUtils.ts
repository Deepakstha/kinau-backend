import { Router, RequestHandler } from "express";

interface RouteLayer {
  route: {
    path: string;
    methods: { [method: string]: boolean };
    stack: RequestHandler[];
  };
  name: string;
  regexp: RegExp;
  handle: {
    stack: RouteLayer[];
  };
}

// Update the type to be more specific
type RouterLayer =
  | RouteLayer
  | {
      name: string;
      handle: {
        stack: RouterLayer[];
      };
      regexp: RegExp;
    };

// Add a type guard
function isRouterMiddleware(
  layer: RouterLayer
): layer is Extract<RouterLayer, { name: string }> {
  return (
    "name" in layer &&
    layer.name === "router" &&
    "handle" in layer &&
    Array.isArray(layer.handle.stack)
  );
}

export function getAllRoutes(router: Router) {
  const routes: Array<{ path: string; method: string }> = [];

  const processLayer = (layer: RouterLayer, path: string = "") => {
    if ("route" in layer && layer.route) {
      // This is a route
      const methods = Object.keys(layer.route.methods).map((method) =>
        method.toUpperCase()
      );
      methods.forEach((method) => {
        routes.push({
          method,
          path: path + layer.route!.path,
        });
      });
    } else if (isRouterMiddleware(layer)) {
      // This is a router middleware
      layer.handle.stack.forEach((sublayer) => {
        processLayer(sublayer, path);
      });
    }
  };

  // Process each layer in the router stack
  (router.stack as unknown as RouterLayer[]).forEach((layer) => {
    processLayer(layer);
  });

  return routes;
}
