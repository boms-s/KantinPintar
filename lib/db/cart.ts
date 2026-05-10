/**
 * Shopping Cart Database Operations
 */

import { prisma } from "@/lib/prisma";

export const cartDb = {
  /**
   * Add item to cart
   */
  async addItem(pembeliId: string, menuId: string, quantity: number) {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      throw new Error("Menu tidak ditemukan");
    }

    // Upsert: tambah quantity jika sudah ada
    return prisma.cartItem.upsert({
      where: {
        pembeliId_menuId: {
          pembeliId,
          menuId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        pembeliId,
        menuId,
        quantity,
        price: menu.price,
      },
      include: {
        menu: true,
      },
    });
  },

  /**
   * Update cart item quantity
   */
  async updateQuantity(
    pembeliId: string,
    menuId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      return this.removeItem(pembeliId, menuId);
    }

    return prisma.cartItem.update({
      where: {
        pembeliId_menuId: {
          pembeliId,
          menuId,
        },
      },
      data: { quantity },
      include: {
        menu: true,
      },
    });
  },

  /**
   * Remove item from cart
   */
  async removeItem(pembeliId: string, menuId: string) {
    return prisma.cartItem.delete({
      where: {
        pembeliId_menuId: {
          pembeliId,
          menuId,
        },
      },
    });
  },

  /**
   * Get cart items
   */
  async getCart(pembeliId: string) {
    const items = await prisma.cartItem.findMany({
      where: { pembeliId },
      include: {
        menu: {
          include: {
            penjual: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
      },
    });

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    return {
      items,
      subtotal,
      itemCount: items.length,
      totalQuantity: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    };
  },

  /**
   * Clear cart
   */
  async clearCart(pembeliId: string) {
    return prisma.cartItem.deleteMany({
      where: { pembeliId },
    });
  },

  /**
   * Get cart grouped by penjual (for checkout)
   */
  async getCartByPenjual(pembeliId: string) {
    const items = await prisma.cartItem.findMany({
      where: { pembeliId },
      include: {
        menu: {
          include: {
            penjual: true,
          },
        },
      },
    });

    // Group by penjual
    const grouped: Record<string, any> = {};

    items.forEach((item: any) => {
      const penjualId = item.menu.penjualId;
      if (!grouped[penjualId]) {
        grouped[penjualId] = {
          penjual: item.menu.penjual,
          items: [],
          subtotal: 0,
        };
      }
      grouped[penjualId].items.push(item);
      grouped[penjualId].subtotal += item.price * item.quantity;
    });

    return Object.values(grouped);
  },
};
