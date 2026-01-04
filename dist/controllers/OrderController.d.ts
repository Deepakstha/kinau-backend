import { Response } from "express";
export declare class OrderController {
    static createOrder: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getMonthlyOrdersAndSales: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getOrders: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getOrderById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static cancelOrder: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getOrderStats: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getAllOrders: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateOrderStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updatePaymentStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getAdminOrderStats: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=OrderController.d.ts.map