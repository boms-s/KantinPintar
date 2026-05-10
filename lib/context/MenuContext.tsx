"use client";

import type { MenuItem } from "@/lib/types";
import React, { createContext, useCallback, useContext, useState } from "react";

interface MenuContextType {
  items: MenuItem[];
  setItems: (items: MenuItem[]) => void;
  loading: boolean;
  error: string | null;
  fetchMenus: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: akan di-replace dengan actual API call
      const storedMenus = typeof window !== "undefined" ? localStorage.getItem("menuItems") : null;
      if (storedMenus) {
        setItems(JSON.parse(storedMenus));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MenuContext.Provider value={{ items, setItems, loading, error, fetchMenus }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within MenuProvider");
  }
  return context;
}
