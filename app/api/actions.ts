"use server";

import { z } from "zod";
import { userDb, menuDb, categoryDb, cartDb, orderDb } from "@/lib/db";
import { cookies } from "next/headers";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const LoginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const RegisterPembeliSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
});

const RegisterPenjualSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  businessName: z.string().min(3, "Nama bisnis minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  city: z.string().min(3, "Kota minimal 3 karakter"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterPembeliInput = z.infer<typeof RegisterPembeliSchema>;
export type RegisterPenjualInput = z.infer<typeof RegisterPenjualSchema>;

// ============================================
// AUTHENTICATION ACTIONS
// ============================================

/**
 * Login user
 */
export async function loginAction(data: LoginInput) {
  try {
    const validated = LoginSchema.parse(data);
    const result = await userDb.login(validated.email, validated.password);

    if (result.success && result.user) {
      // Store session in cookie (should be JWT in production)
      const cookieStore = await cookies();
      cookieStore.set("userId", result.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return {
        success: true,
        message: "Login berhasil",
        user: result.user,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof z.ZodError ? error.issues[0]?.message : "Login gagal",
    };
  }
}

/**
 * Register pembeli (buyer)
 */
export async function registerPembeliAction(data: RegisterPembeliInput) {
  try {
    const validated = RegisterPembeliSchema.parse(data);
    const result = await userDb.registerPembeli({
      username: validated.username,
      email: validated.email,
      password: validated.password,
      fullName: validated.fullName,
      phone: validated.phone,
    });

    if (result.success && result.user) {
      const cookieStore = await cookies();
      cookieStore.set("userId", result.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        success: true,
        message: "Registrasi berhasil",
        user: result.user,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof z.ZodError ? error.issues[0]?.message : "Registrasi gagal",
    };
  }
}

/**
 * Register penjual (seller)
 */
export async function registerPenjualAction(data: RegisterPenjualInput) {
  try {
    const validated = RegisterPenjualSchema.parse(data);
    const result = await userDb.registerPenjual({
      username: validated.username,
      email: validated.email,
      password: validated.password,
      businessName: validated.businessName,
      phone: validated.phone,
      address: validated.address,
      city: validated.city,
    });

    if (result.success && result.user) {
      const cookieStore = await cookies();
      cookieStore.set("userId", result.user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        success: true,
        message: "Registrasi berhasil",
        user: result.user,
      };
    }

    return {
      success: false,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof z.ZodError ? error.issues[0]?.message : "Registrasi gagal",
    };
  }
}

/**
 * Logout user
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  return { success: true, message: "Logout berhasil" };
}

/**
 * Get currently authenticated user from session cookie
 */
export async function getCurrentUserAction() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return {
        success: false,
        message: "Belum login",
        data: null,
      };
    }

    const user = await userDb.getUserById(userId);

    if (!user) {
      return {
        success: false,
        message: "Sesi tidak ditemukan",
        data: null,
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil sesi pengguna",
      data: null,
    };
  }
}

// ============================================
// MENU ACTIONS
// ============================================

/**
 * Get all available menus
 */
export async function getMenusAction(filters?: {
  menuCategoryId?: string;
  search?: string;
}) {
  try {
    const menus = await menuDb.getAllMenus({
      isAvailable: true,
      menuCategoryId: filters?.menuCategoryId,
      search: filters?.search,
    });
    return {
      success: true,
      data: menus,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil menu",
      data: [],
    };
  }
}

/**
 * Get seller menus
 */
export async function getSellerMenusAction(penjualId: string) {
  try {
    const menus = await menuDb.getSellerMenus(penjualId);
    return {
      success: true,
      data: menus,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil menu",
      data: [],
    };
  }
}

/**
 * Get warungs for buyer view, including closed stores and seller profile data.
 */
export async function getWarungsAction() {
  try {
    const menus = await menuDb.getAllMenus({ includeUnavailable: true });
    return {
      success: true,
      data: menus,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil data warung",
      data: [],
    };
  }
}

/**
 * Create menu item (seller only)
 */
export async function createMenuAction(
  penjualId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    menuCategoryId: string;
    stock: number;
    cost?: number;
    image?: string;
  },
) {
  try {
    const menu = await menuDb.create(penjualId, data);
    return {
      success: true,
      message: "Menu berhasil dibuat",
      data: menu,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat menu",
    };
  }
}

/**
 * Update menu item (seller only)
 */
export async function updateMenuAction(
  menuId: string,
  penjualId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    cost?: number;
    menuCategoryId?: string;
    image?: string;
    isAvailable?: boolean;
  },
) {
  try {
    const menu = await menuDb.update(menuId, penjualId, data);
    return {
      success: true,
      message: "Menu berhasil diperbarui",
      data: menu,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui menu",
    };
  }
}

/**
 * Delete menu item (seller only)
 */
export async function deleteMenuAction(menuId: string, penjualId: string) {
  try {
    await menuDb.delete(menuId, penjualId);
    return {
      success: true,
      message: "Menu berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus menu",
    };
  }
}

/**
 * Get seller's categories
 */
export async function getSellerCategoriesAction(penjualId: string) {
  try {
    const categories = await categoryDb.getSellerCategories(penjualId);
    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil kategori",
      data: [],
    };
  }
}

/**
 * Create menu category (seller only)
 */
export async function createMenuCategoryAction(
  penjualId: string,
  data: {
    name: string;
    description?: string;
    icon?: string;
  },
) {
  try {
    // Check if category name already exists
    const exists = await categoryDb.exists(penjualId, data.name);
    if (exists) {
      return {
        success: false,
        message: "Kategori dengan nama ini sudah ada",
      };
    }

    const category = await categoryDb.create(penjualId, data);
    return {
      success: true,
      message: "Kategori berhasil dibuat",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal membuat kategori",
    };
  }
}

/**
 * Update menu category (seller only)
 */
export async function updateMenuCategoryAction(
  categoryId: string,
  penjualId: string,
  data: {
    name?: string;
    description?: string;
    icon?: string;
  },
) {
  try {
    // Check if new name already exists (if changing name)
    if (data.name) {
      const exists = await categoryDb.exists(penjualId, data.name, categoryId);
      if (exists) {
        return {
          success: false,
          message: "Kategori dengan nama ini sudah ada",
        };
      }
    }

    const category = await categoryDb.update(categoryId, penjualId, data);
    return {
      success: true,
      message: "Kategori berhasil diperbarui",
      data: category,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal memperbarui kategori",
    };
  }
}

/**
 * Delete menu category (seller only)
 */
export async function deleteMenuCategoryAction(
  categoryId: string,
  penjualId: string,
) {
  try {
    await categoryDb.delete(categoryId, penjualId);
    return {
      success: true,
      message: "Kategori berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menghapus kategori",
    };
  }
}

// ============================================
// CART ACTIONS
// ============================================

/**
 * Get user's cart
 */
export async function getCartAction(pembeliId: string) {
  try {
    const cart = await cartDb.getCart(pembeliId);
    return {
      success: true,
      data: cart,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil keranjang",
    };
  }
}

/**
 * Add item to cart
 */
export async function addToCartAction(
  pembeliId: string,
  menuId: string,
  quantity: number,
) {
  try {
    const item = await cartDb.addItem(pembeliId, menuId, quantity);
    return {
      success: true,
      message: "Item berhasil ditambahkan",
      data: item,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal menambahkan item",
    };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCartAction(
  pembeliId: string,
  menuId: string,
) {
  try {
    await cartDb.removeItem(pembeliId, menuId);
    return {
      success: true,
      message: "Item berhasil dihapus",
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menghapus item",
    };
  }
}

// ============================================
// ORDER ACTIONS
// ============================================

/**
 * Create order
 */
export async function createOrderAction(
  pembeliId: string,
  penjualId: string,
  data: {
    items: Array<{
      menuId: string;
      quantity: number;
      unitPrice: number;
    }>;
    subtotal: number;
    tax?: number;
    discountAmount?: number;
    shippingCost?: number;
    totalPrice: number;
    paymentMethod: string; // "CASH" | "TRANSFER" | "EWALLETS"
    deliveryType: string;  // "PICKUP" | "DELIVERY"
    deliveryAddress?: string;
    notes?: string;
  },
) {
  try {
    const order = await orderDb.createOrder(
      pembeliId,
      penjualId,
      data as any,
    );

    // Clear cart after order
    await cartDb.clearCart(pembeliId);

    return {
      success: true,
      message: "Pesanan berhasil dibuat",
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal membuat pesanan",
    };
  }
}

/**
 * Get buyer's orders
 */
export async function getBuyerOrdersAction(pembeliId: string) {
  try {
    const orders = await orderDb.getBuyerOrders(pembeliId);
    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil pesanan",
      data: [],
    };
  }
}

/**
 * Get seller's orders
 */
export async function getSellerOrdersAction(penjualId: string) {
  try {
    const orders = await orderDb.getSellerOrders(penjualId);
    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengambil pesanan",
      data: [],
    };
  }
}

/**
 * Update order status (seller only)
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: string,
) {
  try {
    const order = await orderDb.updateStatus(orderId, status as any);
    return {
      success: true,
      message: "Status pesanan berhasil diubah",
      data: order,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal mengubah status",
    };
  }
}

/**
 * Update current seller business status.
 */
export async function updatePenjualStatusAction(data: {
  isOpen: boolean;
  operatingHours?: string | null;
}) {
  try {
    const session = await getCurrentUserAction();

    if (!session.success || !session.data || session.data.role !== "PENJUAL") {
      return {
        success: false,
        message: "Sesi penjual tidak ditemukan",
      };
    }

    const currentUser = session.data;
    const seller = currentUser.penjual;

    if (!seller) {
      return {
        success: false,
        message: "Profil penjual tidak ditemukan",
      };
    }

    const updated = await userDb.updatePenjualProfile(currentUser.id, {
      isOpen: data.isOpen,
      operatingHours: data.operatingHours === null ? undefined : data.operatingHours,
    });

    return {
      success: true,
      message: data.isOpen ? "Warung dibuka" : "Warung ditutup",
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memperbarui status warung",
    };
  }
}

/**
 * Update seller complete profile including description, operating hours, and photo.
 */
export async function updatePenjualProfileAction(data: {
  description?: string;
  operatingHours?: string;
  photoUrl?: string;
  isOpen?: boolean;
}) {
  try {
    const session = await getCurrentUserAction();

    if (!session.success || !session.data || session.data.role !== "PENJUAL") {
      return {
        success: false,
        message: "Sesi penjual tidak ditemukan",
      };
    }

    const currentUser = session.data;
    const seller = currentUser.penjual;

    if (!seller) {
      return {
        success: false,
        message: "Profil penjual tidak ditemukan",
      };
    }

    const updateData: Partial<{
      description: string;
      operatingHours: string | undefined;
      photoUrl: string;
      isOpen: boolean;
    }> = {};
    if (data.description !== undefined) updateData.description = data.description;
    if (data.operatingHours !== undefined)
      updateData.operatingHours = data.operatingHours;
    if (data.photoUrl !== undefined) updateData.photoUrl = data.photoUrl;
    if (data.isOpen !== undefined) updateData.isOpen = data.isOpen;

    const updated = await userDb.updatePenjualProfile(
      currentUser.id,
      updateData
    );

    return {
      success: true,
      message: "Profil berhasil diperbarui",
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: "Gagal memperbarui profil",
    };
  }
}
