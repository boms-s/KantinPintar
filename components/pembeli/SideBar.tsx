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
import { logoutAction } from "@/app/api/actions";
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
    photoUrl?: string | null;
  } | null;
};

export default function SideBar({
  user,
  cartQty = 0,
}: {
  user: SideBarUser | null;
  cartQty?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const base = "/pembeli/dashboard";
  const navItems: NavItem[] = [
    { label: "Dashboard", path: base, icon: Home },
    { label: "Warung", path: `${base}/menu`, icon: UtensilsCrossed },
    { label: "Pesanan Saya", path: `${base}/pesanan`, icon: ShoppingBag },
    {
      label: "Keranjang",
      path: `${base}/keranjang`,
      icon: ShoppingCart,
      badge: cartQty,
    },
    { label: "Riwayat Pesanan", path: `${base}/riwayat`, icon: Clock },
    { label: "Profil", path: `${base}/profil`, icon: User },
    { label: "Bantuan", path: `${base}/bantuan`, icon: HelpCircle },
  ];

  const isActive = (path: string): boolean =>
    path === base ? pathname === base : pathname.startsWith(path);

  const handleLogout = async (): Promise<void> => {
    await logoutAction();
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
            <p className="text-xs text-slate-500">Dashboard Pembeli</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto p-3">
        {navItems.map(({ label, path, icon: Icon, badge }) => (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all w-full group ${
              isActive(path)
                ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="border-t border-gray-100 p-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-gray-50 px-3 py-2.5">
          <div className="relative flex h-8 w-8 shrink-0 overflow-hidden items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
            {user?.pembeli?.photoUrl ? (
              <Image src={user.pembeli.photoUrl} alt="Profile" fill className="object-cover" sizes="32px" />
            ) : (
              user?.pembeli?.fullName?.[0]?.toUpperCase() || "U"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-800">
              {user?.pembeli?.fullName || "User"}
            </p>
            <p className="text-[10px] text-gray-400">Pembeli</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          <LogOut size={15} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
