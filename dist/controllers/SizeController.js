"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeController = void 0;
const SizeService_1 = require("../services/SizeService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class SizeController {
}
exports.SizeController = SizeController;
_a = SizeController;
SizeController.getAllSizes = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userRole = req.user?.role;
    const sizes = await SizeService_1.SizeService.getAllSizes(userRole);
    return response_1.ResponseUtil.success(res, sizes, "Sizes retrieved successfully");
});
SizeController.getSizeById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { sizeId } = req.params;
    if (!sizeId) {
        throw (0, errorHandler_1.createError)("Size ID is required", 400);
    }
    const userRole = req.user?.role;
    const size = await SizeService_1.SizeService.getSizeById(sizeId);
    return response_1.ResponseUtil.success(res, size, "Size retrieved successfully");
});
SizeController.createSize = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const sizeData = req.body;
    const size = await SizeService_1.SizeService.createSize(sizeData);
    return response_1.ResponseUtil.success(res, size, "Size created successfully", 201);
});
SizeController.updateSize = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { sizeId } = req.params;
    const updateData = req.body;
    if (!sizeId) {
        throw (0, errorHandler_1.createError)("Size ID is required", 400);
    }
    const userRole = req.user?.role;
    const size = await SizeService_1.SizeService.updateSize(sizeId, updateData);
    return response_1.ResponseUtil.success(res, size, "Size updated successfully");
});
SizeController.deleteSize = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { sizeId } = req.params;
    if (!sizeId) {
        throw (0, errorHandler_1.createError)("Size ID is required", 400);
    }
    const result = await SizeService_1.SizeService.deleteSize(sizeId);
    return response_1.ResponseUtil.success(res, result, "Size deleted successfully");
});
SizeController.toggleSizeStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { sizeId } = req.params;
    if (!sizeId) {
        throw (0, errorHandler_1.createError)("Size ID is required", 400);
    }
    const userRole = req.user?.role;
    const size = await SizeService_1.SizeService.toggleSizeStatus(sizeId);
    return response_1.ResponseUtil.success(res, size, "Size status updated successfully");
});
//# sourceMappingURL=SizeController.js.map