import { IUser } from "@/types";
import { OrderStatus, PaymentStatus } from "../enum/index";
export declare class OrderService {
    static createOrder(userId: IUser, orderData: {
        shippingAddressId: string;
        paymentMethod: string;
        notes?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("@/types").IOrder> & import("@/types").IOrder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getMonthlyOrdersAndSalesByMonths(year: number, months: number[]): Promise<any[]>;
    static getOrders(userId: string, options?: {
        page?: number;
        limit?: number;
        status?: OrderStatus;
    }): Promise<{
        orders: Omit<import("mongoose").Document<unknown, {}, import("@/types").IOrder> & import("@/types").IOrder & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    }>;
    static getOrderById(orderId: string, userId?: string): Promise<import("mongoose").Document<unknown, {}, import("@/types").IOrder> & import("@/types").IOrder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updateOrderStatus(orderId: string, status: OrderStatus): Promise<import("mongoose").Document<unknown, {}, import("@/types").IOrder> & import("@/types").IOrder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<import("mongoose").Document<unknown, {}, import("@/types").IOrder> & import("@/types").IOrder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static cancelOrder(orderId: string, userId: string, reason: string): Promise<import("mongoose").Document<unknown, {}, import("@/types").IOrder> & import("@/types").IOrder & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    static getOrderStats(userId?: string): Promise<{
        totalOrders: number;
        totalRevenue: any;
        statusBreakdown: any[];
    }>;
}
//# sourceMappingURL=OrderService.d.ts.map