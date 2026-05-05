import { CartItem, MenuItem, Order, PembeliUser, penjual } from "@/lib/types";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function notifyStorageChange(eventName?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (eventName) {
      window.dispatchEvent(new Event(eventName));
    }
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

export const userStorage = {
  get: (): PembeliUser | null => {
    return readJson<PembeliUser | null>("currentUser", readJson<PembeliUser | null>("user", null));
  },
  set: (user: PembeliUser): void => {
    writeJson("currentUser", user);
    writeJson("user", user);
    notifyStorageChange();
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    notifyStorageChange();
  },
};

export const penjualSession = {
  get: (): penjual | null => {
    return readJson<penjual | null>("currentPenjual", readJson<penjual | null>("seller", null));
  },
  set: (seller: penjual): void => {
    writeJson("currentPenjual", seller);
    writeJson("seller", seller);
    notifyStorageChange();
  },
  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("currentPenjual");
    localStorage.removeItem("seller");
    notifyStorageChange();
  },
};

export const penjualStorage = {
  getAll: (): penjual[] => readJson<penjual[]>("penjuals", []),
  set: (items: penjual[]): void => {
    writeJson("penjuals", items);
    notifyStorageChange();
  },
  add: (item: penjual): void => {
    const current = penjualStorage.getAll();
    current.push(item);
    penjualStorage.set(current);
  },
};

export const menuStorage = {
  getAll: (): MenuItem[] => readJson<MenuItem[]>("menus", []),
  set: (items: MenuItem[]): void => {
    writeJson("menus", items);
    menuStorage.notifyUpdate();
  },
  add: (item: MenuItem): void => {
    const current = menuStorage.getAll();
    current.push(item);
    menuStorage.set(current);
  },
  notifyUpdate: (): void => {
    notifyStorageChange("sk_menus_updated");
  },
};

export const cartStorage = {
  getAll: (): CartItem[] => readJson<CartItem[]>("cart", []),
  set: (items: CartItem[]): void => {
    writeJson("cart", items);
    notifyStorageChange("sk_cart_updated");
  },
  add: (item: Partial<CartItem> & { id: string; name: string; price: number }, qty = 1): void => {
    const current = cartStorage.getAll();
    const existing = current.find((c) => c.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      current.push({
        id: item.id,
        name: item.name,
        price: Number(item.price) || 0,
        qty,
        image: item.image,
        penjualId: item.penjualId,
      });
    }
    cartStorage.set(current);
  },
  updateQty: (id: string, qty: number): void => {
    const current = cartStorage.getAll();
    const target = current.find((c) => c.id === id);
    if (!target) return;
    target.qty = Math.max(1, qty);
    cartStorage.set(current);
  },
  remove: (id: string): void => {
    const current = cartStorage.getAll().filter((c) => c.id !== id);
    cartStorage.set(current);
  },
  clear: (): void => {
    cartStorage.set([]);
  },
  getTotalQty: (): number => {
    return cartStorage.getAll().reduce((acc, item) => acc + (item.qty || 0), 0);
  },
  getTotalPrice: (): number => {
    return cartStorage
      .getAll()
      .reduce((acc, item) => acc + (Number(item.price) || 0) * (item.qty || 0), 0);
  },
};

export const orderStorage = {
  getAll: (): Order[] => readJson<Order[]>("orders", []),
  set: (items: Order[]): void => {
    writeJson("orders", items);
    notifyStorageChange();
  },
  add: (order: Order): void => {
    const current = orderStorage.getAll();
    current.push(order);
    orderStorage.set(current);
  },
  update: (id: string, updates: Partial<Order>): void => {
    const current = orderStorage.getAll();
    const index = current.findIndex((o) => o.id === id);
    if (index === -1) return;
    current[index] = { ...current[index], ...updates };
    orderStorage.set(current);
  },
};

export const favoriteStorage = {
  getAll: (): string[] => readJson<string[]>("favorites", []),
  set: (items: string[]): void => {
    writeJson("favorites", items);
    notifyStorageChange();
  },
  toggle: (menuId: string): void => {
    const current = favoriteStorage.getAll();
    const exists = current.includes(menuId);
    favoriteStorage.set(exists ? current.filter((id) => id !== menuId) : [...current, menuId]);
  },
};
