"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(res, data, message = "Success", statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(response);
    }
    static error(res, message = "Internal Server Error", statusCode = 500, errors) {
        const response = {
            success: false,
            message,
            error: message,
            ...(errors && { errors }),
        };
        return res.status(statusCode).json(response);
    }
    static validationError(res, errors, message = "Validation failed") {
        const response = {
            success: false,
            message,
            errors,
        };
        return res.status(400).json(response);
    }
    static notFound(res, message = "Resource not found") {
        return this.error(res, message, 404);
    }
    static unauthorized(res, message = "Unauthorized access") {
        return this.error(res, message, 401);
    }
    static forbidden(res, message = "Access forbidden") {
        return this.error(res, message, 403);
    }
    static paginated(res, data, page, limit, total, message = "Success") {
        const pages = Math.ceil(total / limit);
        const response = {
            success: true,
            message,
            data,
            pagination: {
                page,
                limit,
                total,
                pages,
            },
        };
        return res.status(200).json(response);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.js.map