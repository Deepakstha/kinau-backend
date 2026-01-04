"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SizeService = void 0;
const Size_1 = require("../models/Size");
const errorHandler_1 = require("../middlewares/errorHandler");
class SizeService {
    static async getAllSizes(userRole) {
        const filter = {};
        if (userRole !== "admin") {
            filter.isActive = true;
        }
        const sizes = await Size_1.Size.find(filter).sort({
            order: 1,
            name: 1,
        });
        return sizes;
    }
    static async getSizeById(sizeId) {
        const size = await Size_1.Size.findById(sizeId);
        if (!size) {
            throw (0, errorHandler_1.createError)("Size not found", 404);
        }
        return size;
    }
    static async createSize(sizeData) {
        const existingSize = await Size_1.Size.findOne({
            $or: [{ name: sizeData.name }, { code: sizeData.code }],
        });
        if (existingSize) {
            throw (0, errorHandler_1.createError)("Size with this name or code already exists", 400);
        }
        const size = new Size_1.Size(sizeData);
        await size.save();
        return size;
    }
    static async updateSize(sizeId, updateData) {
        const size = await Size_1.Size.findById(sizeId);
        if (!size) {
            throw (0, errorHandler_1.createError)("Size not found", 404);
        }
        if (updateData.name || updateData.code) {
            const existingSize = await Size_1.Size.findOne({
                _id: { $ne: sizeId },
                $or: [
                    ...(updateData.name ? [{ name: updateData.name }] : []),
                    ...(updateData.code ? [{ code: updateData.code }] : []),
                ],
            });
            if (existingSize) {
                throw (0, errorHandler_1.createError)("Size with this name or code already exists", 400);
            }
        }
        Object.assign(size, updateData);
        await size.save();
        return size;
    }
    static async deleteSize(sizeId) {
        const size = await Size_1.Size.findById(sizeId);
        if (!size) {
            throw (0, errorHandler_1.createError)("Size not found", 404);
        }
        await Size_1.Size.findByIdAndDelete(sizeId);
        return { message: "Size deleted successfully" };
    }
    static async toggleSizeStatus(sizeId) {
        const size = await Size_1.Size.findById(sizeId);
        if (!size) {
            throw (0, errorHandler_1.createError)("Size not found", 404);
        }
        size.isActive = !size.isActive;
        await size.save();
        return size;
    }
}
exports.SizeService = SizeService;
//# sourceMappingURL=SizeService.js.map