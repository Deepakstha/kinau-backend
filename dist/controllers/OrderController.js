"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const OrderService_1 = require("../services/OrderService");
const response_1 = require("../utils/response");
class OrderController {
}
exports.OrderController = OrderController;
_a = OrderController;
OrderController.createOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const { shippingAddressId, paymentMethod, notes } = req.body;
    const order = await OrderService_1.OrderService.createOrder(user, {
        shippingAddressId,
        paymentMethod,
        notes,
    });
    return response_1.ResponseUtil.success(res, order, "Order created successfully", 201);
});
OrderController.getMonthlyOrdersAndSales = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { year, months } = req.body;
    const orderAndSales = await OrderService_1.OrderService.getMonthlyOrdersAndSalesByMonths(year, months);
    return response_1.ResponseUtil.success(res, orderAndSales, "Monthly order and Sales");
});
OrderController.getOrders = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { page, limit, status } = req.query;
    const result = await OrderService_1.OrderService.getOrders(userId.toString(), {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        status: status,
    });
    return response_1.ResponseUtil.paginated(res, result.orders, result.pagination.currentPage, result.pagination.itemsPerPage, result.pagination.totalItems, "Orders retrieved successfully");
});
OrderController.getOrderById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { orderId } = req.params;
    if (!orderId) {
        return response_1.ResponseUtil.error(res, "Order ID is required", 400);
    }
    const order = await OrderService_1.OrderService.getOrderById(orderId, userId.toString());
    return response_1.ResponseUtil.success(res, order, "Order retrieved successfully");
});
OrderController.cancelOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const { orderId } = req.params;
    if (!orderId) {
        return response_1.ResponseUtil.error(res, "Order ID is required", 400);
    }
    const { reason } = req.body;
    if (!reason) {
        return response_1.ResponseUtil.error(res, "Reason is required", 400);
    }
    const order = await OrderService_1.OrderService.cancelOrder(orderId, userId.toString(), reason);
    return response_1.ResponseUtil.success(res, order, "Order cancelled successfully");
});
OrderController.getOrderStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user._id;
    const stats = await OrderService_1.OrderService.getOrderStats(userId.toString());
    return response_1.ResponseUtil.success(res, stats, "Order statistics retrieved successfully");
});
OrderController.getAllOrders = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page, limit, status } = req.query;
    const result = await OrderService_1.OrderService.getOrders("", {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        status: status ? status : undefined,
    });
    return response_1.ResponseUtil.paginated(res, result.orders, result.pagination.currentPage, result.pagination.itemsPerPage, result.pagination.totalItems, "All orders retrieved successfully");
});
OrderController.updateOrderStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!orderId) {
        return response_1.ResponseUtil.error(res, "Order ID is required", 400);
    }
    if (!status) {
        return response_1.ResponseUtil.error(res, "Status is required", 400);
    }
    const order = await OrderService_1.OrderService.updateOrderStatus(orderId, status);
    return response_1.ResponseUtil.success(res, order, "Order status updated successfully");
});
OrderController.updatePaymentStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { orderId } = req.params;
    const { paymentStatus, transactionId } = req.body;
    if (!orderId) {
        return response_1.ResponseUtil.error(res, "Order ID is required", 400);
    }
    if (!paymentStatus) {
        return response_1.ResponseUtil.error(res, "Payment status is required", 400);
    }
    const order = await OrderService_1.OrderService.updatePaymentStatus(orderId, paymentStatus, transactionId);
    return response_1.ResponseUtil.success(res, order, "Payment status updated successfully");
});
OrderController.getAdminOrderStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const stats = await OrderService_1.OrderService.getOrderStats();
    return response_1.ResponseUtil.success(res, stats, "Admin order statistics retrieved successfully");
});
//# sourceMappingURL=OrderController.js.map