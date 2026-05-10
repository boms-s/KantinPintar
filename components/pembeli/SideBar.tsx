"use client";

import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  ShoppingCart,
  Clock,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/api/actions";
import { cartStorage } from "@/lib/storage";
import Image from "next/image";

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size: number }>;
  badge?: number;
}

type SideBarUser = {
  pembeli?: {
    fullName: string;
  } | null;
};

export default function SideBar({ user }: { user: SideBarUser | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number>(() => {
    try {
      return cartStorage.getTotalQty();
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const updateCartCount = () => {
      try {
        setCartCount(cartStorage.getTotalQty());
      } catch {
        setCartCount(0);
      }
    };

    window.addEventListener("sk_cart_updated", updateCartCount);
    return () => window.removeEventListener("sk_cart_updated", updateCartCount);
  }, []);

  const base = "/pembeli/dashboard";
  const navItems: NavItem[] = [
    { label: "Dashboard", path: base, icon: Home },
    { label: "Warung", path: `${base}/menu`, icon: UtensilsCrossed },
    { label: "Pesanan Saya", path: `${base}/pesanan`, icon: ShoppingBag },
    {
      label: "Keranjang",
      path: `${base}/keranjang`,
      icon: ShoppingCart,
      badge: cartCount,
    },
    { label: "Riwayat Pesanan", path: `${base}/riwayat`, icon: Clock },
    { label: "Profil", path: `${base}/profil`, icon: User },
    { label: "Bantuan", path: `${base}/bantuan`, icon: HelpCircle },
  ];

  const isActive = (path: string): boolean =>
    path === base ? pathname === base : pathname.startsWith(path);

  const handleLogout = async (): Promise<void> => {
    await logoutAction();
    cartStorage.clear();
    router.push("/pembeli/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo Kantin Pintar"
            width={44}
            height={44}
            className="object-contain"
            priority
          />

          <div>
            <h1 className="font-bold text-slate-950 text-sm">KANTIN PINTAR</h1>
            <p className="text-xs text-slate-500">Dashboard Penjual</p>
          </div>
        </div>
      </div>  

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, path, icon: Icon, badge }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors w-full ${
              isActive(path)
                ? "bg-blue-50 text-blue-600 font-medium"
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

      {/* User Profile & Logout */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 px-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
            {user?.pembeli?.fullName?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 truncate">
              {user?.pembeli?.fullName || "User"}
            </p>
            <p className="text-[10px] text-gray-400">Pembeli</p>
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
