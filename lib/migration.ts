/**
 * Migration Utilities - Helper functions to migrate data from localStorage to database
 * Use in API routes to bulk import data from browser localStorage
 */

import { prisma } from "@/lib/prisma";
import {
  PembeliUser,
  penjual,
  MenuItem,
  CartItem,
  Order,
} from "@/lib/types";

export const migrationUtils = {
  /**
   * Import users from localStorage format to database
   * Use: Call from API route with data from localStorage export
   */
  importUsers: async (users: PembeliUser[]): Promise<number> => {
    let imported = 0;
    for (const user of users) {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            fullName: user.fullName,
            phone: user.phone,
            address: user.address,
          },
          create: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            password: "", // TODO: Use actual password or generate temp one
            phone: user.phone,
            address: user.address,
            role: "pembeli",
          },
        });
        imported++;
      } catch (error) {
        console.error(`Failed to import user ${user.email}:`, error);
      }
    }
    return imported;
  },

  /**
   * Import sellers from localStorage format to database
   */
  importSellers: async (sellers: penjual[]): Promise<number> => {
    let imported = 0;
    for (const seller of sellers) {
      try {
        await prisma.seller.upsert({
          where: { email: seller.email || `seller-${seller.id}@default.com` },
          update: {
            fullName: seller.fullName,
            description: seller.description,
            image: seller.image,
            rating: seller.rating,
            location: seller.location,
          },
          create: {
            id: seller.id,
            fullName: seller.fullName,
            email: seller.email || `seller-${seller.id}@default.com`,
            password: "", // TODO: Use actual password or generate temp one
            phone: seller.phone,
            role: "penjual",
            description: seller.description,
            image: seller.image,
            rating: seller.rating,
            location: seller.location,
          },
        });
        imported++;
      } catch (error) {
        console.error(`Failed to import seller ${seller.fullName}:`, error);
      }
    }
    return imported;
  },

  /**
   * Import menu items from localStorage format to database
   */
  importMenuItems: async (
    items: MenuItem[],
    sellerMap?: Map<string, string>
  ): Promise<number> => {
    let imported = 0;
    for (const item of items) {
      try {
        const sellerId = sellerMap?.get(item.penjualId) || item.penjualId;

        // Check if seller exists
        const seller = await prisma.seller.findUnique({
          where: { id: sellerId },
        });
        if (!seller) {
          console.warn(`Seller ${sellerId} not found for menu item ${item.id}`);
          continue;
        }

        await prisma.menuItem.upsert({
          where: { id: item.id },
          update: {
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            available: item.available,
          },
          create: {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            sellerId,
            category: item.category,
            available: item.available,
          },
        });
        imported++;
      } catch (error) {
        console.error(`Failed to import menu item ${item.id}:`, error);
      }
    }
    return imported;
  },

  /**
   * Import orders from localStorage format to database
   */
  importOrders: async (
    orders: Order[],
    userMap?: Map<string, string>,
    sellerMap?: Map<string, string>
  ): Promise<number> => {
    let imported = 0;
    for (const order of orders) {
      try {
        const userId = userMap?.get(order.userId) || order.userId;
        const sellerId =
          sellerMap?.get(order.items[0]?.penjualId || "") ||
          order.items[0]?.penjualId ||
          "";

        if (!userId || !sellerId) {
          console.warn(`User or Seller not found for order ${order.id}`);
          continue;
        }

        await prisma.order.upsert({
          where: { id: order.id },
          update: {
            status: order.status,
            totalPrice: order.totalPrice,
            notes: order.notes,
          },
          create: {
            id: order.id,
            userId,
            sellerId,
            totalPrice: order.totalPrice,
            status: order.status,
            notes: order.notes,
            createdAt: new Date(order.createdAt),
            items: {
              create: order.items.map((item: CartItem) => ({
                menuItemId: item.id,
                qty: item.qty,
                price: item.price,
              })),
            },
          },
        });
        imported++;
      } catch (error) {
        console.error(`Failed to import order ${order.id}:`, error);
      }
    }
    return imported;
  },

  /**
   * Full migration from localStorage exports (if you can export from browser)
   * Expected format:
   * {
   *   users: [...],
   *   sellers: [...],
   *   menuItems: [...],
   *   orders: [...]
   * }
   */
  migrateAllFromExport: async (data: {
    users?: PembeliUser[];
    sellers?: penjual[];
    menuItems?: MenuItem[];
    orders?: Order[];
  }): Promise<{
    usersImported: number;
    sellersImported: number;
    menuItemsImported: number;
    ordersImported: number;
  }> => {
    try {
      const sellersImported = await migrationUtils.importSellers(
        data.sellers || []
      );
      const menuItemsImported = await migrationUtils.importMenuItems(
        data.menuItems || []
      );
      const usersImported = await migrationUtils.importUsers(
        data.users || []
      );
      const ordersImported = await migrationUtils.importOrders(
        data.orders || []
      );

      return {
        usersImported,
        sellersImported,
        menuItemsImported,
        ordersImported,
      };
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  },
};
