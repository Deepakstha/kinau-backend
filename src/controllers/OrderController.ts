import { OrderStatus } from "@/enum";
import { Response } from "express";
import { asyncHandler } from "../middlewares/errorHandler";
import { OrderService } from "../services/OrderService";
import { AuthRequest } from "../types";
import { ResponseUtil } from "../utils/response";

export class OrderController {
  static createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user;
    const { shippingAddressId, paymentMethod, notes } = req.body;

    const order = await OrderService.createOrder(user!, {
      shippingAddressId,
      paymentMethod,
      notes,
    });

    return ResponseUtil.success(res, order, "Order created successfully", 201);
  });


  static getMonthlyOrdersAndSales = asyncHandler (async(req: AuthRequest, res: Response)=>{
    const {year, months} = req.body;
    const orderAndSales = await OrderService.getMonthlyOrdersAndSalesByMonths(year, months);
    return ResponseUtil.success(res, orderAndSales, "Monthly order and Sales")
  }) 
  
  static getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const { page, limit, status } = req.query;

    const result = await OrderService.getOrders(userId.toString(), {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as OrderStatus,
    });

    return ResponseUtil.paginated(
      res,
      result.orders,
      result.pagination.currentPage,
      result.pagination.itemsPerPage,
      result.pagination.totalItems,
      "Orders retrieved successfully"
    );
  });

  static getOrderById = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const { orderId } = req.params;

      if (!orderId) {
        return ResponseUtil.error(res, "Order ID is required", 400);
      }

      const order = await OrderService.getOrderById(orderId, userId.toString());

      return ResponseUtil.success(res, order, "Order retrieved successfully");
    }
  );

  static cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!._id;
    const { orderId } = req.params;

    if (!orderId) {
      return ResponseUtil.error(res, "Order ID is required", 400);
    }

    const { reason } = req.body;

    if (!reason) {
      return ResponseUtil.error(res, "Reason is required", 400);
    }

    const order = await OrderService.cancelOrder(
      orderId,
      userId.toString(),
      reason
    );

    return ResponseUtil.success(res, order, "Order cancelled successfully");
  });

  static getOrderStats = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const userId = req.user!._id;
      const stats = await OrderService.getOrderStats(userId.toString());

      return ResponseUtil.success(
        res,
        stats,
        "Order statistics retrieved successfully"
      );
    }
  );

  // Admin only endpoints
  static getAllOrders = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { page, limit, status } = req.query;

      const result = await OrderService.getOrders("", {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status ? (status as OrderStatus) : undefined,
      });

      return ResponseUtil.paginated(
        res,
        result.orders,
        result.pagination.currentPage,
        result.pagination.itemsPerPage,
        result.pagination.totalItems,
        "All orders retrieved successfully"
      );
    }
  );

  static updateOrderStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!orderId) {
        return ResponseUtil.error(res, "Order ID is required", 400);
      }

      if (!status) {
        return ResponseUtil.error(res, "Status is required", 400);
      }

      const order = await OrderService.updateOrderStatus(orderId, status);

      return ResponseUtil.success(
        res,
        order,
        "Order status updated successfully"
      );
    }
  );

  static updatePaymentStatus = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const { orderId } = req.params;
      const { paymentStatus, transactionId } = req.body;

      if (!orderId) {
        return ResponseUtil.error(res, "Order ID is required", 400);
      }

      if (!paymentStatus) {
        return ResponseUtil.error(res, "Payment status is required", 400);
      }

      const order = await OrderService.updatePaymentStatus(
        orderId,
        paymentStatus,
        transactionId
      );

      return ResponseUtil.success(
        res,
        order,
        "Payment status updated successfully"
      );
    }
  );

  static getAdminOrderStats = asyncHandler(
    async (req: AuthRequest, res: Response) => {
      const stats = await OrderService.getOrderStats();

      return ResponseUtil.success(
        res,
        stats,
        "Admin order statistics retrieved successfully"
      );
    }
  );
}
