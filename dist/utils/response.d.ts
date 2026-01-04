import { Response } from "express";
export declare class ResponseUtil {
    static success<T>(res: Response, data: T, message?: string, statusCode?: number): Response;
    static error(res: Response, message?: string, statusCode?: number, errors?: any[]): Response;
    static validationError(res: Response, errors: any[], message?: string): Response;
    static notFound(res: Response, message?: string): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static paginated<T>(res: Response, data: T[], page: number, limit: number, total: number, message?: string): Response;
}
//# sourceMappingURL=response.d.ts.map