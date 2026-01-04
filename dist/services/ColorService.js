"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorService = void 0;
const Color_1 = require("../models/Color");
const errorHandler_1 = require("../middlewares/errorHandler");
class ColorService {
    static async getAllColors(userRole) {
        const filter = {};
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const colors = await Color_1.Color.find(filter).sort({ name: 1 });
        return colors;
    }
    static async getColorById(colorId) {
        const color = await Color_1.Color.findOne({ _id: colorId });
        if (!color) {
            throw (0, errorHandler_1.createError)("Color not found", 404);
        }
        return color;
    }
    static async createColor(colorData) {
        const existingColor = await Color_1.Color.findOne({
            $or: [{ name: colorData.name }, { hexCode: colorData.hexCode }],
        });
        if (existingColor) {
            throw (0, errorHandler_1.createError)("Color with this name or hex code already exists", 400);
        }
        const color = new Color_1.Color(colorData);
        await color.save();
        return color;
    }
    static async updateColor(colorId, updateData) {
        const color = await Color_1.Color.findById(colorId);
        if (!color) {
            throw (0, errorHandler_1.createError)("Color not found", 404);
        }
        if (updateData.name || updateData.hexCode) {
            const existingColor = await Color_1.Color.findOne({
                _id: { $ne: colorId },
                $or: [
                    ...(updateData.name ? [{ name: updateData.name }] : []),
                    ...(updateData.hexCode ? [{ hexCode: updateData.hexCode }] : []),
                ],
            });
            if (existingColor) {
                throw (0, errorHandler_1.createError)("Color with this name or hex code already exists", 400);
            }
        }
        Object.assign(color, updateData);
        await color.save();
        return color;
    }
    static async deleteColor(colorId) {
        const color = await Color_1.Color.findById(colorId);
        if (!color) {
            throw (0, errorHandler_1.createError)("Color not found", 404);
        }
        await Color_1.Color.findByIdAndDelete(colorId);
        return { message: "Color deleted successfully" };
    }
    static async toggleColorStatus(colorId) {
        const color = await Color_1.Color.findById(colorId);
        if (!color) {
            throw (0, errorHandler_1.createError)("Color not found", 404);
        }
        color.isActive = !color.isActive;
        await color.save();
        return color;
    }
}
exports.ColorService = ColorService;
//# sourceMappingURL=ColorService.js.map