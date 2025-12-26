import { Size } from "../models/Size";
import { createError } from "../middlewares/errorHandler";

export class SizeService {
  static async getAllSizes(userRole?: string) {
    const filter: any = {};

    // If user is not admin, filter by isActive: true
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const sizes = await Size.find(filter).sort({
      order: 1,
      name: 1,
    });
    return sizes;
  }

  static async getSizeById(sizeId: string) {
    const size = await Size.findById(sizeId);
    if (!size) {
      throw createError("Size not found", 404);
    }
    return size;
  }

  static async createSize(sizeData: {
    name: string;
    code: string;
    description?: string;
    order?: number;
  }) {
    // Check if size with same name or code already exists
    const existingSize = await Size.findOne({
      $or: [{ name: sizeData.name }, { code: sizeData.code }],
    });

    if (existingSize) {
      throw createError("Size with this name or code already exists", 400);
    }

    const size = new Size(sizeData);
    await size.save();
    return size;
  }

  static async updateSize(
    sizeId: string,
    updateData: {
      name?: string;
      code?: string;
      description?: string;
      order?: number;
      isActive?: boolean;
    }
  ) {
    const size = await Size.findById(sizeId);
    if (!size) {
      throw createError("Size not found", 404);
    }

    // Check for duplicate name or code if updating
    if (updateData.name || updateData.code) {
      const existingSize = await Size.findOne({
        _id: { $ne: sizeId },
        $or: [
          ...(updateData.name ? [{ name: updateData.name }] : []),
          ...(updateData.code ? [{ code: updateData.code }] : []),
        ],
      });

      if (existingSize) {
        throw createError("Size with this name or code already exists", 400);
      }
    }

    Object.assign(size, updateData);
    await size.save();
    return size;
  }

  static async deleteSize(sizeId: string) {
    const size = await Size.findById(sizeId);
    if (!size) {
      throw createError("Size not found", 404);
    }

    await Size.findByIdAndDelete(sizeId);
    return { message: "Size deleted successfully" };
  }

  static async toggleSizeStatus(sizeId: string) {
    const size = await Size.findById(sizeId);
    if (!size) {
      throw createError("Size not found", 404);
    }

    size.isActive = !size.isActive;
    await size.save();
    return size;
  }
}
