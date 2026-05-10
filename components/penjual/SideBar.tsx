"use client";

import {
  Home,
  Box,
  ShoppingCart,
  BarChart2,
  User,
  LogOut,
  ChefHat,
  TrendingUp,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSellerOrdersAction, logoutAction, updatePenjualStatusAction } from "@/app/api/actions";
import Image from "next/image";

type PenjualSidebarUser = {
  id: string;
  email: string;
  penjual?: {
    id: string;
    businessName: string;
    isOpen?: boolean;
    photoUrl?: string | null;
  } | null;
} | null;

export default function SideBar({ user }: { user: PenjualSidebarUser }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(user?.penjual?.isOpen ?? true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (user?.penjual?.isOpen !== undefined) {
      setIsOpen(user.penjual.isOpen);
    }
  }, [user?.penjual?.isOpen]);

  const toggleStatus = async () => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    const newStatus = !isOpen;
    setIsOpen(newStatus); // Optimistic UI
    try {
      const res = await updatePenjualStatusAction({ isOpen: newStatus });
      if (!res.success) {
        setIsOpen(!newStatus); // Revert on failure
      }
    } catch {
      setIsOpen(!newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (!user?.penjual?.id) return;
      try {
        const res = await getSellerOrdersAction(user.penjual.id);
        if (res.success && res.data) {
          const count = res.data.filter((o: any) => o.status === "CONFIRMED").length;
          setPendingCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch pending orders", error);
      }
    };

    fetchPendingOrders();
    // Poll every 15 seconds to keep the indicator updated
    const interval = setInterval(fetchPendingOrders, 15000);
    return () => clearInterval(interval);
  }, [user?.penjual?.id]);

  const base = "/penjual/dashboard";
  const navItems = [
    { label: "Dashboard", path: base, icon: Home },
    {
      label: "Pesanan",
      path: `${base}/pesanan`,
      icon: Box,
      badge: pendingCount,
    },
    { label: "Kelola Menu", path: `${base}/kelolaMenu`, icon: ChefHat },
    {
      label: "Kategori Menu",
      path: `${base}/kelolaKategori`,
      icon: ShoppingCart,
    },
    { label: "Laporan Penjualan", path: `${base}/penjualan`, icon: TrendingUp },
    { label: "Profil Toko", path: `${base}/profil`, icon: User },
  ];

  const isActive = (path: string) =>
    path === base ? pathname === base : pathname.startsWith(path);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/penjual/login");
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

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(({ label, path, icon: Icon, badge }) => (
          <button
            key={label}
            onClick={() => router.push(path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive(path)
                ? "bg-violet-50 text-violet-600 border border-violet-200 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {badge && badge > 0 && (
              <span className="inline-flex items-center justify-center min-w-max bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-50 p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full bg-linear-to-br from-violet-100 to-violet-50 flex items-center justify-center text-violet-600 font-bold text-sm shrink-0">
              {user?.penjual?.photoUrl ? (
                <Image src={user.penjual.photoUrl} alt="Profile" fill className="object-cover" sizes="40px" />
              ) : (
                (user?.penjual?.businessName || user?.email || "P")[0].toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.penjual?.businessName || "Penjual"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
          
          {/* Status Toggle */}
          <div className="pt-3 border-t border-slate-200 mt-1 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">Status Warung</span>
              <span className={`text-[10px] font-medium ${isOpen ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isOpen ? 'Buka (Terima Pesanan)' : 'Tutup (Jeda Pesanan)'}
              </span>
            </div>
            <button
              onClick={toggleStatus}
              disabled={isUpdatingStatus}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 disabled:cursor-wait ${
                isOpen ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={isOpen}
            >
              <span className="sr-only">Toggle shop status</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isOpen ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
