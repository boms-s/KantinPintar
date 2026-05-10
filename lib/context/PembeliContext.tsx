"use client";

import { createContext, useContext } from "react";

export type PembeliUser = {
  id: string;
  role: string;
  pembeli?: {
    id: string;
    fullName: string;
    phone: string;
    address?: string | null;
    city?: string | null;
  } | null;
};

type PembeliContextValue = {
  user: PembeliUser | null;
  pembeliId: string | null;
  cartQty: number;
  /** Panggil setelah perubahan keranjang agar sidebar badge sync */
  refreshCartQty: () => Promise<void>;
};

export const PembeliContext = createContext<PembeliContextValue>({
  user: null,
  pembeliId: null,
  cartQty: 0,
  refreshCartQty: async () => {},
});

export function usePembeli() {
  return useContext(PembeliContext);
}
