"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorController = void 0;
const ColorService_1 = require("../services/ColorService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middlewares/errorHandler");
class ColorController {
}
exports.ColorController = ColorController;
_a = ColorController;
ColorController.getAllColors = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userRole = req.user?.role;
    const colors = await ColorService_1.ColorService.getAllColors(userRole);
    return response_1.ResponseUtil.success(res, colors, "Colors retrieved successfully");
});
ColorController.getColorById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { colorId } = req.params;
    if (!colorId) {
        return response_1.ResponseUtil.error(res, "Color ID is required", 400);
    }
    const color = await ColorService_1.ColorService.getColorById(colorId);
    return response_1.ResponseUtil.success(res, color, "Color retrieved successfully");
});
ColorController.createColor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const colorData = req.body;
    const color = await ColorService_1.ColorService.createColor(colorData);
    return response_1.ResponseUtil.success(res, color, "Color created successfully", 201);
});
ColorController.updateColor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { colorId } = req.params;
    if (!colorId) {
        return response_1.ResponseUtil.error(res, "Color ID is required", 400);
    }
    const updateData = req.body;
    const color = await ColorService_1.ColorService.updateColor(colorId, updateData);
    return response_1.ResponseUtil.success(res, color, "Color updated successfully");
});
ColorController.deleteColor = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { colorId } = req.params;
    if (!colorId) {
        return response_1.ResponseUtil.error(res, "Color ID is required", 400);
    }
    const result = await ColorService_1.ColorService.deleteColor(colorId);
    return response_1.ResponseUtil.success(res, result, "Color deleted successfully");
});
ColorController.toggleColorStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { colorId } = req.params;
    if (!colorId) {
        return response_1.ResponseUtil.error(res, "Color ID is required", 400);
    }
    const userRole = req.user?.role;
    const color = await ColorService_1.ColorService.toggleColorStatus(colorId);
    return response_1.ResponseUtil.success(res, color, "Color status updated successfully");
});
//# sourceMappingURL=ColorController.js.map