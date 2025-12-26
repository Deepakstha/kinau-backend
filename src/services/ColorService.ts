import { Color } from "../models/Color";
import { createError } from "../middlewares/errorHandler";

export class ColorService {
  static async getAllColors(userRole?: string) {
    const filter: any = {};

    // Only admins can see inactive records, everyone else (including public) sees only active
    if (userRole !== "admin") {
      filter.isActive = true;
    }

    const colors = await Color.find(filter).sort({ name: 1 });
    return colors;
  }

  static async getColorById(colorId: string) {
    const color = await Color.findOne({ _id: colorId });
    if (!color) {
      throw createError("Color not found", 404);
    }
    return color;
  }

  static async createColor(colorData: {
    name: string;
    hexCode: string;
    description?: string;
  }) {
    // Check if color with same name or hex code already exists
    const existingColor = await Color.findOne({
      $or: [{ name: colorData.name }, { hexCode: colorData.hexCode }],
    });

    if (existingColor) {
      throw createError("Color with this name or hex code already exists", 400);
    }

    const color = new Color(colorData);
    await color.save();
    return color;
  }

  static async updateColor(
    colorId: string,
    updateData: {
      name?: string;
      hexCode?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const color = await Color.findById(colorId);
    if (!color) {
      throw createError("Color not found", 404);
    }

    // Check for duplicate name or hex code if updating
    if (updateData.name || updateData.hexCode) {
      const existingColor = await Color.findOne({
        _id: { $ne: colorId },
        $or: [
          ...(updateData.name ? [{ name: updateData.name }] : []),
          ...(updateData.hexCode ? [{ hexCode: updateData.hexCode }] : []),
        ],
      });

      if (existingColor) {
        throw createError(
          "Color with this name or hex code already exists",
          400
        );
      }
    }

    Object.assign(color, updateData);
    await color.save();
    return color;
  }

  static async deleteColor(colorId: string) {
    const color = await Color.findById(colorId);
    if (!color) {
      throw createError("Color not found", 404);
    }

    await Color.findByIdAndDelete(colorId);
    return { message: "Color deleted successfully" };
  }

  static async toggleColorStatus(colorId: string) {
    const color = await Color.findById(colorId);
    if (!color) {
      throw createError("Color not found", 404);
    }

    color.isActive = !color.isActive;
    await color.save();
    return color;
  }
}
