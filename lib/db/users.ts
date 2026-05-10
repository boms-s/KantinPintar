/**
 * User Database Operations
 * Handles authentication and user profile management
 */

import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";

export const userDb = {
  // ============================================
  // AUTHENTICATION
  // ============================================

  /**
   * Register new user (Pembeli)
   */
  async registerPembeli(data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) {
    try {
      const hashedPassword = await hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          role: "PEMBELI" as any,
          pembeli: {
            create: {
              fullName: data.fullName,
              phone: data.phone,
            },
          },
        },
        include: {
          pembeli: true,
        },
      });

      return { success: true, user };
    } catch (error: any) {
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0];
        return {
          success: false,
          message: `${field} sudah terdaftar`,
        };
      }
      return { success: false, message: "Gagal mendaftar" };
    }
  },

  /**
   * Register new seller (Penjual)
   */
  async registerPenjual(data: {
    username: string;
    email: string;
    password: string;
    businessName: string;
    phone: string;
    address: string;
    city: string;
  }) {
    try {
      const hashedPassword = await hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          role: "PENJUAL" as any,
          penjual: {
            create: {
              businessName: data.businessName,
              phone: data.phone,
              address: data.address,
              city: data.city,
            },
          },
        },
        include: {
          penjual: true,
        },
      });

      return { success: true, user };
    } catch (error: any) {
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0];
        return {
          success: false,
          message: `${field} sudah terdaftar`,
        };
      }
      return { success: false, message: "Gagal mendaftar" };
    }
  },

  /**
   * Login user
   */
  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          pembeli: true,
          penjual: true,
          admin: true,
        },
      });

      if (!user) {
        return { success: false, message: "Email tidak ditemukan" };
      }

      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        return { success: false, message: "Password salah" };
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.pembeli || user.penjual || user.admin,
        },
      };
    } catch (error) {
      return { success: false, message: "Gagal login" };
    }
  },

  /**
   * Get user by ID with relationships
   */
  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        pembeli: true,
        penjual: true,
        admin: true,
      },
    });
  },

  /**
   * Update user profile
   */
  async updatePembeliProfile(
    userId: string,
    data: Partial<{
      fullName: string;
      phone: string;
      address: string;
      city: string;
      photoUrl: string;
    }>,
  ) {
    return prisma.pembeli.update({
      where: { userId },
      data,
    });
  },

  async updatePenjualProfile(
    userId: string,
    data: Partial<{
      businessName: string;
      description: string;
      phone: string;
      address: string;
      city: string;
      photoUrl: string;
      isOpen: boolean;
      operatingHours: string | undefined;
    }>,
  ) {
    return prisma.penjual.update({
      where: { userId },
      data,
    });
  },
};
