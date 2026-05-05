/**
 * Cart Service - Shopping cart operations
 * Handles cart item management
 */

import { prisma } from "@/lib/prisma";
import { CartItem, MenuItem } from "@/lib/types";

export const cartService = {
  // Get cart items for user
  getByUserId: async (userId: string): Promise<CartItem[]> => {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { menuItem: { include: { seller: true } } },
    });
    return cartItems.map(mapCartItemToCartItem);
  },

  // Add item to cart
  addItem: async (
    userId: string,
    menuItem: MenuItem,
    qty: number = 1
  ): Promise<CartItem> => {
    // Check if item already in cart
    const existing = await prisma.cartItem.findUnique({
      where: { userId_menuItemId: { userId, menuItemId: menuItem.id } },
      include: { menuItem: { include: { seller: true } } },
    });

    if (existing) {
      // Update quantity
      const updated = await prisma.cartItem.update({
        where: { userId_menuItemId: { userId, menuItemId: menuItem.id } },
        data: { qty: existing.qty + qty },
        include: { menuItem: { include: { seller: true } } },
      });
      return mapCartItemToCartItem(updated);
    }

    // Create new cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        menuItemId: menuItem.id,
        qty,
      },
      include: { menuItem: { include: { seller: true } } },
    });
    return mapCartItemToCartItem(cartItem);
  },

  // Remove item from cart
  removeItem: async (userId: string, menuItemId: string): Promise<void> => {
    await prisma.cartItem.delete({
      where: { userId_menuItemId: { userId, menuItemId } },
    });
  },

  // Update item quantity
  updateQty: async (
    userId: string,
    menuItemId: string,
    qty: number
  ): Promise<CartItem | null> => {
    if (qty <= 0) {
      await cartService.removeItem(userId, menuItemId);
      return null;
    }

    const cartItem = await prisma.cartItem.update({
      where: { userId_menuItemId: { userId, menuItemId } },
      data: { qty },
      include: { menuItem: { include: { seller: true } } },
    });
    return mapCartItemToCartItem(cartItem);
  },

  // Clear entire cart
  clear: async (userId: string): Promise<void> => {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
  },

  // Get total quantity in cart
  getTotalQty: async (userId: string): Promise<number> => {
    const result = await prisma.cartItem.aggregate({
      where: { userId },
      _sum: { qty: true },
    });
    return result._sum.qty || 0;
  },

  // Get total price in cart
  getTotalPrice: async (userId: string): Promise<number> => {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { menuItem: true },
    });
    return cartItems.reduce((total, item) => {
      return total + Number(item.menuItem.price) * item.qty;
    }, 0);
  },
};

// Helper: Map Prisma CartItem to CartItem type
function mapCartItemToCartItem(cartItem: any): CartItem {
  return {
    id: cartItem.menuItem.id,
    name: cartItem.menuItem.name,
    description: cartItem.menuItem.description,
    price: Number(cartItem.menuItem.price),
    image: cartItem.menuItem.image,
    penjualId: cartItem.menuItem.sellerId,
    penjualName: cartItem.menuItem.seller?.fullName,
    category: cartItem.menuItem.category,
    available: cartItem.menuItem.available,
    qty: cartItem.qty,
  };
}
