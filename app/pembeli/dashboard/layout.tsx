"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SideBar from "@/components/pembeli/SideBar";
import { getCurrentUserAction, getCartAction } from "@/app/api/actions";
import { PembeliContext, type PembeliUser } from "@/lib/context/PembeliContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<PembeliUser | null>(null);
  const [cartQty, setCartQty] = useState(0);

  const refreshCartQty = useCallback(async () => {
    const pid = user?.pembeli?.id;
    if (!pid) return;
    const result = await getCartAction(pid);
    if (result.success && result.data) {
      setCartQty((result.data as any).totalQuantity ?? 0);
    }
  }, [user]);

  // Single session check — runs once on mount
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const result = await getCurrentUserAction();

      if (cancelled) return;

      if (!result.success || !result.data || result.data.role !== "PEMBELI") {
        router.replace("/pembeli/login");
        return;
      }

      const u = result.data as PembeliUser;
      setUser(u);

      // Load initial cart count
      if (u.pembeli?.id) {
        const cartResult = await getCartAction(u.pembeli.id);
        if (!cancelled && cartResult.success && cartResult.data) {
          setCartQty((cartResult.data as any).totalQuantity ?? 0);
        }
      }

      if (!cancelled) setIsLoading(false);
    };

    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Empty array: only run once on mount, NOT on router change

  // Listen for cart update events from child pages
  useEffect(() => {
    const handler = async () => {
      const pid = user?.pembeli?.id;
      if (!pid) return;
      const result = await getCartAction(pid);
      if (result.success && result.data) {
        setCartQty((result.data as any).totalQuantity ?? 0);
      }
    };
    window.addEventListener("sk_cart_updated", handler);
    return () => window.removeEventListener("sk_cart_updated", handler);
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f6f8fb]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <PembeliContext.Provider value={{ user, pembeliId: user?.pembeli?.id ?? null, cartQty, refreshCartQty }}>
      <div className="flex bg-[#f6f8fb] min-h-screen">
        <SideBar user={user} cartQty={cartQty} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </PembeliContext.Provider>
  );
}
