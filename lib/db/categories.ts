/**
 * Menu Category Database Operations
 * Handles menu category management for sellers
 */

import { prisma } from "@/lib/prisma";

export const categoryDb = {
  /**
   * Create new category for a seller
   */
  async create(penjualId: string, data: {
    name: string;
    description?: string;
    icon?: string;
  }) {
    return prisma.menuCategory.create({
      data: {
        ...data,
        penjualId,
      },
    });
  },

  /**
   * Get all categories for a seller
   */
  async getSellerCategories(penjualId: string) {
    return prisma.menuCategory.findMany({
      where: { penjualId },
      include: {
        _count: {
          select: { menus: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string) {
    return prisma.menuCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });
  },

  /**
   * Update category
   */
  async update(
    categoryId: string,
    penjualId: string,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
    }>,
  ) {
    // Verify ownership
    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId },
    });

    if (category?.penjualId !== penjualId) {
      throw new Error("Unauthorized");
    }

    return prisma.menuCategory.update({
      where: { id: categoryId },
      data,
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });
  },

  /**
   * Delete category (only if no menus are using it)
   */
  async delete(categoryId: string, penjualId: string) {
    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    if (category?.penjualId !== penjualId) {
      throw new Error("Unauthorized");
    }

    if ((category?._count?.menus || 0) > 0) {
      throw new Error("Kategori tidak dapat dihapus karena masih ada menu yang menggunakannya");
    }

    return prisma.menuCategory.delete({
      where: { id: categoryId },
    });
  },

  /**
   * Check if category name already exists for a seller
   */
  async exists(penjualId: string, name: string, excludeId?: string) {
    const existing = await prisma.menuCategory.findFirst({
      where: {
        penjualId,
        name,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
    return !!existing;
  },
};
