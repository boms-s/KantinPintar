/**
 * Centralized Storage Utility untuk Smart Kantin
 * Menggunakan localStorage dengan namespace yang konsisten
 */

import {
  PembeliUser,
  penjual,
  MenuItem,
  CartItem,
  Order,
} from "./types";

const STORAGE_KEYS = {
  CURRENT_USER: "sk_current_user",
  CURRENT_PENJUAL: "sk_current_penjual",
  penjualS: "sk_penjuals",
  MENUS: "sk_menus",
  CART: "sk_cart",
  ORDERS: "sk_orders",
  FAVORITES: "sk_favorites",
};

// ============ USER OPERATIONS ============
export const userStorage = {
  get: (): PembeliUser | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem("currentUser");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set: (user: PembeliUser): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  isLoggedIn: (): boolean => {
    return userStorage.get() !== null;
  },
};

// ============ PENJUAL SESSION ============
export const penjualSession = {
  get: (): penjual | null => {
    try {
      const data =
        localStorage.getItem(STORAGE_KEYS.CURRENT_PENJUAL) ||
        localStorage.getItem("currentpenjual");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  set: (seller: penjual): void => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PENJUAL, JSON.stringify(seller));
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PENJUAL);
  },

  isLoggedIn: (): boolean => {
    return penjualSession.get() !== null;
  },
};

// ============ penjual OPERATIONS ============
export const penjualStorage = {
  getAll: (): penjual[] => {
    try {
      const primary = localStorage.getItem(STORAGE_KEYS.penjualS);
      const legacy = localStorage.getItem("penjuals");

      // If legacy exists but primary key doesn't, migrate legacy -> primary
      if (!primary && legacy) {
        try {
          localStorage.setItem(STORAGE_KEYS.penjualS, legacy);
        } catch {}
      }

      const data = primary || legacy;
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getById: (id: string): penjual | null => {
    const penjuals = penjualStorage.getAll();
    return penjuals.find((s) => s.id === id) || null;
  },

  set: (penjuals: penjual[]): void => {
    localStorage.setItem(STORAGE_KEYS.penjualS, JSON.stringify(penjuals));
  },

  add: (penjual: penjual): void => {
    const penjuals = penjualStorage.getAll();
    penjuals.push(penjual);
    penjualStorage.set(penjuals);
  },
};

// ============ MENU/FOOD OPERATIONS ============
export const menuStorage = {
  getAll: (): MenuItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENUS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getBypenjualId: (penjualId: string): MenuItem[] => {
    const menus = menuStorage.getAll();
    return menus.filter((m) => m.penjualId === penjualId);
  },

  getById: (id: string): MenuItem | null => {
    const menus = menuStorage.getAll();
    return menus.find((m) => m.id === id) || null;
  },

  getGroupedBypenjual: (): Map<string, MenuItem[]> => {
    const menus = menuStorage.getAll();
    const grouped = new Map<string, MenuItem[]>();

    menus.forEach((menu) => {
      const penjualId = menu.penjualId;
      if (!grouped.has(penjualId)) {
        grouped.set(penjualId, []);
      }
      grouped.get(penjualId)!.push(menu);
    });

    return grouped;
  },

  set: (menus: MenuItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(menus));
    menuStorage.notifyUpdate();
  },

  add: (menu: MenuItem): void => {
    const menus = menuStorage.getAll();
    menus.push(menu);
    menuStorage.set(menus);
  },

  notifyUpdate: (): void => {
    if (typeof window !== "undefined") {
      // Dispatch custom event for same-tab listeners
      window.dispatchEvent(new CustomEvent("sk_menus_updated"));
      // Also use storage key hack to trigger other tabs/windows
      try {
        localStorage.setItem("sk_menus_last_update", String(Date.now()));
      } catch {}
    }
  },
};

// ============ CART OPERATIONS ============
export const cartStorage = {
  getAll: (): CartItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add: (item: MenuItem, qty: number = 1): void => {
    const cart = cartStorage.getAll();
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...item, qty });
    }

    cartStorage.set(cart);
    cartStorage.notifyUpdate();
  },

  remove: (itemId: string): void => {
    const cart = cartStorage.getAll().filter((c) => c.id !== itemId);
    cartStorage.set(cart);
    cartStorage.notifyUpdate();
  },

  updateQty: (itemId: string, qty: number): void => {
    const cart = cartStorage.getAll();
    const item = cart.find((c) => c.id === itemId);
    if (item) {
      item.qty = Math.max(0, qty);
      if (item.qty === 0) {
        cartStorage.remove(itemId);
      } else {
        cartStorage.set(cart);
        cartStorage.notifyUpdate();
      }
    }
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CART);
    cartStorage.notifyUpdate();
  },

  getTotalQty: (): number => {
    return cartStorage.getAll().reduce((acc, item) => acc + item.qty, 0);
  },

  getTotalPrice: (): number => {
    return cartStorage.getAll().reduce((acc, item) => acc + item.price * item.qty, 0);
  },

  set: (cart: CartItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  notifyUpdate: (): void => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sk_cart_updated"));
    }
  },
};

// ============ ORDER OPERATIONS ============
export const orderStorage = {
  getAll: (): Order[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getById: (id: string): Order | null => {
    const orders = orderStorage.getAll();
    return orders.find((o) => o.id === id) || null;
  },

  getByStatus: (status: Order["status"]): Order[] => {
    const orders = orderStorage.getAll();
    return orders.filter((o) => o.status === status);
  },

  add: (order: Order): void => {
    const orders = orderStorage.getAll();
    orders.push(order);
    orderStorage.set(orders);
  },

  update: (id: string, updates: Partial<Order>): void => {
    const orders = orderStorage.getAll();
    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], ...updates };
      orderStorage.set(orders);
    }
  },

  set: (orders: Order[]): void => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  getTotalSpent: (userId: string): number => {
    return orderStorage
      .getAll()
      .filter((o) => o.userId === userId && o.status === "completed")
      .reduce((acc, order) => acc + order.totalPrice, 0);
  },
};

// ============ FAVORITES OPERATIONS ============
export const favoriteStorage = {
  getAll: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  add: (menuId: string): void => {
    const favorites = favoriteStorage.getAll();
    if (!favorites.includes(menuId)) {
      favorites.push(menuId);
      favoriteStorage.set(favorites);
    }
  },

  remove: (menuId: string): void => {
    const favorites = favoriteStorage.getAll().filter((f) => f !== menuId);
    favoriteStorage.set(favorites);
  },

  isFavorite: (menuId: string): boolean => {
    return favoriteStorage.getAll().includes(menuId);
  },

  set: (favorites: string[]): void => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  getFavoriteItems: (): MenuItem[] => {
    const favorites = favoriteStorage.getAll();
    const menus = menuStorage.getAll();
    return menus.filter((m) => favorites.includes(m.id));
  },
};
