/**
 * Type definitions untuk Smart Kantin
 */

// User/Pembeli Type
export interface PembeliUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: "pembeli";
}

// penjual Type
export interface penjual {
  id: string;
  fullName: string;
  name?: string;
  email?: string;
  password?: string;
  role?: "penjual";
  description?: string;
  image?: string;
  rating?: number;
  location?: string;
}

// Menu/Food Item Type
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  penjualId: string;
  penjualName?: string;
  category?: string;
  available: boolean;
}

// Cart Item Type
export interface CartItem extends MenuItem {
  qty: number;
}

// Order Type
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

// Pembeli Dashboard Stats Type
export interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
  favoriteItems: MenuItem[];
}
