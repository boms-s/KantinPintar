/**
 * User Service - Pembeli (Customer) operations
 * Handles user registration, login, profile management
 */

import { prisma } from "@/lib/prisma";
import { PembeliUser } from "@/lib/types";

export const userService = {
  // Get current user by ID
  getById: async (id: string): Promise<PembeliUser | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? mapUserToPembeliUser(user) : null;
  },

  // Get user by email
  getByEmail: async (email: string): Promise<PembeliUser | null> => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user ? mapUserToPembeliUser(user) : null;
  },

  // Create new user
  create: async (userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<PembeliUser> => {
    const user = await prisma.user.create({
      data: {
        ...userData,
        role: "pembeli",
      },
    });
    return mapUserToPembeliUser(user);
  },

  // Update user profile
  update: async (
    id: string,
    updates: Partial<PembeliUser>
  ): Promise<PembeliUser> => {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });
    return mapUserToPembeliUser(user);
  },

  // Get all users (admin only)
  getAll: async (): Promise<PembeliUser[]> => {
    const users = await prisma.user.findMany();
    return users.map(mapUserToPembeliUser);
  },

  // Delete user
  delete: async (id: string): Promise<void> => {
    await prisma.user.delete({
      where: { id },
    });
  },
};

// Helper: Map Prisma User to PembeliUser type
function mapUserToPembeliUser(user: any): PembeliUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || undefined,
    address: user.address || undefined,
    role: "pembeli",
  };
}
