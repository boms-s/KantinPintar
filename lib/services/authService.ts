/**
 * Authentication Service
 * Handles user registration, login, JWT token generation
 */

import jwt from "jsonwebtoken";
import { userService } from "@/lib/services/userService";
import { sellerService } from "@/lib/services/sellerService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  id: string;
  email: string;
  role: "pembeli" | "penjual" | "admin";
  iat: number;
  exp: number;
}

export const authService = {
  // Generate JWT token
  generateToken: (payload: {
    id: string;
    email: string;
    role: "pembeli" | "penjual" | "admin";
  }): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  },

  // Verify JWT token
  verifyToken: (token: string): JWTPayload | null => {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  },

  // Register new user (pembeli)
  registerUser: async (
    fullName: string,
    email: string,
    password: string,
    phone?: string,
    address?: string
  ) => {
    // TODO: Hash password with bcrypt before storing
    const user = await userService.create({
      fullName,
      email,
      password, // Should be hashed
      phone,
      address,
    });

    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      role: "pembeli",
    });

    return { user, token };
  },

  // Register new seller (penjual)
  registerSeller: async (
    fullName: string,
    email: string,
    password: string,
    phone?: string,
    description?: string,
    location?: string
  ) => {
    // TODO: Hash password with bcrypt before storing
    const seller = await sellerService.create({
      fullName,
      email,
      password, // Should be hashed
      phone,
      description,
      location,
    });

    const token = authService.generateToken({
      id: seller.id,
      email: seller.email,
      role: "penjual",
    });

    return { seller, token };
  },

  // Login user (pembeli)
  loginUser: async (email: string, password: string) => {
    const user = await userService.getByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // TODO: Compare hashed password
    // const isValidPassword = await bcrypt.compare(password, user.password);
    // if (!isValidPassword) throw new Error("Invalid password");

    const token = authService.generateToken({
      id: user.id,
      email: user.email,
      role: "pembeli",
    });

    return { user, token };
  },

  // Login seller (penjual)
  loginSeller: async (email: string, password: string) => {
    const seller = await sellerService.getByEmail(email);
    if (!seller) {
      throw new Error("Seller not found");
    }

    // TODO: Compare hashed password
    // const isValidPassword = await bcrypt.compare(password, seller.password);
    // if (!isValidPassword) throw new Error("Invalid password");

    const token = authService.generateToken({
      id: seller.id,
      email: seller.email,
      role: "penjual",
    });

    return { seller, token };
  },
};
