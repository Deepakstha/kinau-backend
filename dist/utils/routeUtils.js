"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRoutes = getAllRoutes;
function isRouterMiddleware(layer) {
    return ("name" in layer &&
        layer.name === "router" &&
        "handle" in layer &&
        Array.isArray(layer.handle.stack));
}
function getAllRoutes(router) {
    const routes = [];
    const processLayer = (layer, path = "") => {
        if ("route" in layer && layer.route) {
            const methods = Object.keys(layer.route.methods).map((method) => method.toUpperCase());
            methods.forEach((method) => {
                routes.push({
                    method,
                    path: path + layer.route.path,
                });
            });
        }
        else if (isRouterMiddleware(layer)) {
            layer.handle.stack.forEach((sublayer) => {
                processLayer(sublayer, path);
            });
        }
    };
    router.stack.forEach((layer) => {
        processLayer(layer);
    });
    return routes;
}
//# sourceMappingURL=routeUtils.js.map