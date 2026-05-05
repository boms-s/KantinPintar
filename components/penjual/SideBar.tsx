"use client";

import { Home, Box, ShoppingCart, BarChart2, User, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { penjual as PenjualType } from "@/lib/types";
import { penjualSession, orderStorage } from "@/lib/storage";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [seller] = useState<PenjualType | null>(() => penjualSession.get());
  const [pendingCount, setPendingCount] = useState<number>(() => {
    try {
      const orders = orderStorage.getAll();
      return orders.filter((o) => o.status === "pending").length;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    // keep pending count in sync if orders change elsewhere
    const handler = () => {
      try {
        const orders = orderStorage.getAll();
        setPendingCount(orders.filter((o) => o.status === "pending").length);
      } catch {}
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const base = "/penjual/dashboard";
  const navItems = [
    { label: "Dashboard", path: base, icon: Home },
    { label: "Pesanan", path: `${base}/pesanan`, icon: Box, badge: pendingCount },
    { label: "Kelola Menu", path: `${base}/kelolaMenu`, icon: ShoppingCart },
    { label: "Penjualan", path: `${base}/pnejualan`, icon: BarChart2 },
    { label: "Profil", path: `${base}/profil`, icon: User },
  ];

  const isActive = (path: string) => (path === base ? pathname === base : pathname.startsWith(path));

  const handleLogout = () => {
    penjualSession.clear();
    router.push("/penjual/login");
  };

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col p-4 shrink-0 h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-7 h-7 bg-purple-600 rounded-md" />
        <h1 className="font-bold text-purple-600 text-sm tracking-wide">SMART KANTIN</h1>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, path, icon: Icon, badge }) => (
          <button
            key={label}
            onClick={() => router.push(path)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors w-full ${
              isActive(path)
                ? "bg-purple-50 text-purple-600 font-medium"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {badge && badge > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 px-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
            {seller?.fullName?.[0] || "P"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">{seller?.fullName || "Penjual"}</p>
            <p className="text-[10px] text-gray-400">Penjual</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={16} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
