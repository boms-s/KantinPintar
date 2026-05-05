export interface PembeliUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role?: "pembeli" | "penjual" | "admin";
}

export interface penjual {
  id: string;
  fullName: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: "penjual";
  description?: string;
  image?: string;
  rating?: number;
  location?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  penjualId: string;
  category?: string;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  penjualId?: string;
  penjualName?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminCredentials {
  fullName: string;
  email: string;
  password: string;
}
