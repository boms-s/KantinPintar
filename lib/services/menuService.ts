/**
 * Menu Service - MenuItem operations
 * Handles menu/product CRUD and retrieval
 */

import { prisma } from "@/lib/prisma";
import { MenuItem } from "@/lib/types";

export const menuService = {
  // Get all menu items
  getAll: async (): Promise<MenuItem[]> => {
    const items = await prisma.menuItem.findMany({
      include: { seller: true },
    });
    return items.map(mapMenuItemToMenuItem);
  },

  // Get menu item by ID
  getById: async (id: string): Promise<MenuItem | null> => {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { seller: true },
    });
    return item ? mapMenuItemToMenuItem(item) : null;
  },

  // Get menu items by seller
  getBySellerId: async (sellerId: string): Promise<MenuItem[]> => {
    const items = await prisma.menuItem.findMany({
      where: { sellerId },
      include: { seller: true },
    });
    return items.map(mapMenuItemToMenuItem);
  },

  // Get menu items grouped by seller
  getGroupedBySeller: async (): Promise<Map<string, MenuItem[]>> => {
    const items = await prisma.menuItem.findMany({
      include: { seller: true },
    });
    const grouped = new Map<string, MenuItem[]>();

    items.forEach((item) => {
      const sellerId = item.sellerId;
      if (!grouped.has(sellerId)) {
        grouped.set(sellerId, []);
      }
      grouped.get(sellerId)!.push(mapMenuItemToMenuItem(item));
    });

    return grouped;
  },

  // Create menu item
  create: async (menuData: {
    name: string;
    price: number;
    sellerId: string;
    description?: string;
    image?: string;
    category?: string;
    available?: boolean;
  }): Promise<MenuItem> => {
    const item = await prisma.menuItem.create({
      data: menuData,
      include: { seller: true },
    });
    return mapMenuItemToMenuItem(item);
  },

  // Update menu item
  update: async (
    id: string,
    updates: Partial<MenuItem>
  ): Promise<MenuItem> => {
    const item = await prisma.menuItem.update({
      where: { id },
      data: updates,
      include: { seller: true },
    });
    return mapMenuItemToMenuItem(item);
  },

  // Delete menu item
  delete: async (id: string): Promise<void> => {
    await prisma.menuItem.delete({
      where: { id },
    });
  },

  // Get available items
  getAvailable: async (): Promise<MenuItem[]> => {
    const items = await prisma.menuItem.findMany({
      where: { available: true },
      include: { seller: true },
    });
    return items.map(mapMenuItemToMenuItem);
  },

  // Get items by category
  getByCategory: async (category: string): Promise<MenuItem[]> => {
    const items = await prisma.menuItem.findMany({
      where: { category },
      include: { seller: true },
    });
    return items.map(mapMenuItemToMenuItem);
  },
};

// Helper: Map Prisma MenuItem to MenuItem type
function mapMenuItemToMenuItem(item: any): MenuItem {
  return {
    id: item.id,
    name: item.name,
    description: item.description || undefined,
    price: Number(item.price),
    image: item.image || undefined,
    penjualId: item.sellerId,
    penjualName: item.seller?.fullName,
    category: item.category || undefined,
    available: item.available,
  };
}
