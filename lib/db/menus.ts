/**
 * Menu Database Operations
 * Handles menu management for sellers
 */

import { prisma } from "@/lib/prisma";

export const menuDb = {
  /**
   * Create new menu item
   */
  async create(penjualId: string, data: {
    name: string;
    description?: string;
    price: number;
    menuCategoryId: string;
    stock: number;
    cost?: number;
    image?: string;
  }) {
    return prisma.menu.create({
      data: {
        ...data,
        penjualId,
      },
      include: {
        menuCategory: true,
      },
    });
  },

  /**
   * Get all menus for a seller
   */
  async getSellerMenus(penjualId: string) {
    return prisma.menu.findMany({
      where: { penjualId },
      include: {
        menuCategory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get all menus with filters
   */
  async getAllMenus(filters?: {
    menuCategoryId?: string;
    penjualId?: string;
    isAvailable?: boolean;
    search?: string;
    includeUnavailable?: boolean;
  }) {
    return prisma.menu.findMany({
      where: {
        menuCategoryId: filters?.menuCategoryId,
        penjualId: filters?.penjualId,
        isAvailable: filters?.includeUnavailable
          ? undefined
          : filters?.isAvailable !== undefined
            ? filters.isAvailable
            : true,
        OR: filters?.search
          ? [
              { name: { contains: filters.search } },
              { description: { contains: filters.search } },
            ]
          : undefined,
      },
      include: {
        menuCategory: true,
        penjual: {
          select: {
            id: true,
            businessName: true,
            address: true,
            city: true,
            photoUrl: true,
            isOpen: true,
            operatingHours: true,
            averageRating: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Get menu by ID
   */
  async getMenuById(menuId: string) {
    return prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        menuCategory: true,
        penjual: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  /**
   * Update menu
   */
  async update(
    menuId: string,
    penjualId: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      cost: number;
      image: string;
      isAvailable: boolean;
      menuCategoryId: string;
    }>,
  ) {
    // Verify ownership
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (menu?.penjualId !== penjualId) {
      throw new Error("Unauthorized");
    }

    return prisma.menu.update({
      where: { id: menuId },
      data,
      include: {
        menuCategory: true,
      },
    });
  },

  /**
   * Delete menu
   */
  async delete(menuId: string, penjualId: string) {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (menu?.penjualId !== penjualId) {
      throw new Error("Unauthorized");
    }

    return prisma.menu.delete({
      where: { id: menuId },
    });
  },

  /**
   * Update stock
   */
  async updateStock(menuId: string, quantity: number) {
    return prisma.menu.update({
      where: { id: menuId },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  },

};

