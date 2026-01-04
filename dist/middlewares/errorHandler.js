"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.globalErrorHandler = exports.createError = exports.AppError = void 0;
const response_1 = require("../utils/response");
const config_1 = require("../config");
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const createError = (message, statusCode = 500) => {
    return new AppError(message, statusCode);
};
exports.createError = createError;
const globalErrorHandler = (error, res) => {
    let { statusCode = 500, message } = error;
    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((err) => err.message)
            .join(", ");
    }
    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    if (error.code === 11000) {
        statusCode = 400;
        const field = Object.keys(error.keyValue)[0];
        message = `${field} already exists`;
    }
    if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    if (config_1.config.NODE_ENV === "development") {
        console.error("Error:", error);
    }
    return response_1.ResponseUtil.error(res, message, statusCode);
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundHandler = (req, res) => {
    return response_1.ResponseUtil.notFound(res, `Route ${req.originalUrl} not found`);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map