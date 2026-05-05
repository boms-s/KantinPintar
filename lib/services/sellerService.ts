/**
 * Seller Service - Penjual (Vendor) operations
 * Handles seller registration, profile, store management
 */

import { prisma } from "@/lib/prisma";
import { penjual } from "@/lib/types";

export const sellerService = {
  // Get seller by ID
  getById: async (id: string): Promise<penjual | null> => {
    const seller = await prisma.seller.findUnique({
      where: { id },
    });
    return seller ? mapSellerToPenjual(seller) : null;
  },

  // Get seller by email
  getByEmail: async (email: string): Promise<penjual | null> => {
    const seller = await prisma.seller.findUnique({
      where: { email },
    });
    return seller ? mapSellerToPenjual(seller) : null;
  },

  // Create new seller
  create: async (sellerData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    description?: string;
    location?: string;
  }): Promise<penjual> => {
    const seller = await prisma.seller.create({
      data: {
        ...sellerData,
        role: "penjual",
      },
    });
    return mapSellerToPenjual(seller);
  },

  // Update seller profile
  update: async (id: string, updates: Partial<penjual>): Promise<penjual> => {
    const seller = await prisma.seller.update({
      where: { id },
      data: updates,
    });
    return mapSellerToPenjual(seller);
  },

  // Get all sellers (with optional pagination)
  getAll: async (skip?: number, take?: number): Promise<penjual[]> => {
    const sellers = await prisma.seller.findMany({
      skip,
      take,
    });
    return sellers.map(mapSellerToPenjual);
  },

  // Get seller with their menu items
  getWithMenus: async (id: string) => {
    const seller = await prisma.seller.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    return seller
      ? {
          ...mapSellerToPenjual(seller),
          menuItems: seller.menuItems,
        }
      : null;
  },

  // Delete seller
  delete: async (id: string): Promise<void> => {
    await prisma.seller.delete({
      where: { id },
    });
  },
};

// Helper: Map Prisma Seller to penjual type
function mapSellerToPenjual(seller: any): penjual {
  return {
    id: seller.id,
    fullName: seller.fullName,
    name: seller.fullName, // compatibility
    email: seller.email || undefined,
    role: "penjual",
    description: seller.description || undefined,
    image: seller.image || undefined,
    rating: seller.rating || 0,
    location: seller.location || undefined,
  };
}
