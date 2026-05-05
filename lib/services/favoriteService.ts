/**
 * Favorite Service - User favorites/likes
 * Handles favorite menu items
 */

import { prisma } from "@/lib/prisma";
import { MenuItem } from "@/lib/types";

export const favoriteService = {
  // Get user's favorite menu IDs
  getByUserId: async (userId: string): Promise<string[]> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { favorites: { select: { id: true } } },
    });
    return user?.favorites.map((f) => f.id) || [];
  },

  // Get user's favorite menu items with details
  getFavoriteItems: async (userId: string): Promise<MenuItem[]> => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          include: { seller: true },
        },
      },
    });

    return (
      user?.favorites.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image,
        penjualId: item.sellerId,
        penjualName: item.seller?.fullName,
        category: item.category,
        available: item.available,
      })) || []
    );
  },

  // Add to favorites
  addFavorite: async (userId: string, menuItemId: string): Promise<void> => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          connect: { id: menuItemId },
        },
      },
    });
  },

  // Remove from favorites
  removeFavorite: async (userId: string, menuItemId: string): Promise<void> => {
    await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          disconnect: { id: menuItemId },
        },
      },
    });
  },

  // Check if item is favorite
  isFavorite: async (userId: string, menuItemId: string): Promise<boolean> => {
    const count = await prisma.user.count({
      where: {
        id: userId,
        favorites: {
          some: { id: menuItemId },
        },
      },
    });
    return count > 0;
  },

  // Toggle favorite
  toggleFavorite: async (
    userId: string,
    menuItemId: string
  ): Promise<boolean> => {
    const isFav = await favoriteService.isFavorite(userId, menuItemId);

    if (isFav) {
      await favoriteService.removeFavorite(userId, menuItemId);
      return false;
    } else {
      await favoriteService.addFavorite(userId, menuItemId);
      return true;
    }
  },
};
