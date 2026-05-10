"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MenuItem } from "@/lib/types";
import { menuStorage, orderStorage } from "@/lib/storage";
import SalesChart from "@/components/penjual/SalesChart";
import { ArrowRight, BarChart3, CalendarDays, CircleDollarSign, Package, Plus, Settings2, Trash2, Clock, TrendingUp, Users, Zap, ChefHat } from "lucide-react";
import { getCurrentUserAction } from "@/app/api/actions";

type OrderItem = { penjualId?: string; name?: string; price?: number; qty?: number };

type SellerOrder = {
  id: string;
  items: OrderItem[];
  totalPrice?: number;
  status?: string;
  createdAt?: string;
};

type CurrentSeller = {
  id: string;
  email: string;
  penjual?: {
    id: string;
    businessName: string;
    address: string;
    city: string;
    isOpen: boolean;
    operatingHours?: string | null;
  } | null;
};

export default function PenjualDashboard() {
  const router = useRouter();

  const [seller, setSeller] = useState<CurrentSeller | null>(null);
  const allOrders: SellerOrder[] = orderStorage.getAll();
  const [allMenus, setAllMenus] = useState<MenuItem[]>(() => menuStorage.getAll());

  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState({ name: "", price: "", available: true });

  useEffect(() => {
    const loadSession = async () => {
      const result = await getCurrentUserAction();
      if (!result.success || !result.data || result.data.role !== "PENJUAL") {
        router.replace("/penjual/login");
        return;
      }

      setSeller({
        id: result.data.penjual?.id || result.data.id,
        email: result.data.email,
        penjual: result.data.penjual || null,
      });
    };

    loadSession();
  }, [router]);

  // Orders that include this seller's items
  const sellerOrders = useMemo(() => {
    if (!seller) return [] as SellerOrder[];
    return allOrders.filter((o: SellerOrder) => Array.isArray(o.items) && o.items.some((it: OrderItem) => it.penjualId === seller.id));
  }, [allOrders, seller]);

  // Menus that belong to this seller
  const sellerMenus = useMemo(() => {
    if (!seller) return [] as MenuItem[];
    return allMenus.filter((m) => m.penjualId === seller.id);
  }, [allMenus, seller]);

  const stats = useMemo(() => {
    const totalOrders = sellerOrders.length;
    const completed = sellerOrders.filter((o) => o.status === "completed" || o.status === "selesai").length;
    const pending = sellerOrders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
    const totalIncome = sellerOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    const avgPerOrder = completed > 0 ? Math.round(totalIncome / completed) : 0;
    return { totalOrders, completed, pending, totalIncome, avgPerOrder };
  }, [sellerOrders]);

  // prepare chart data: last 7 completed orders (or pad with zeros)
  const chartData = useMemo(() => {
    const completed = sellerOrders.filter((o) => o.status === "completed" || o.status === "selesai");
    const last = completed.slice(-7);
    const points = last.map((o, i) => ({ label: `${i + 1}`, value: Math.round(o.totalPrice || 0) }));
    while (points.length < 7) points.unshift({ label: "", value: 0 });
    return points;
  }, [sellerOrders]);

  // Menu CRUD
  function saveNewMenu() {
    if (!seller) return;
    if (!menuForm.name || !menuForm.price) return;
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: menuForm.name,
      price: Number(menuForm.price),
      penjualId: seller.id,
      penjualName: seller.penjual?.businessName || seller.email || "",
      available: menuForm.available,
    } as MenuItem;

    menuStorage.add(newItem);
    setAllMenus(menuStorage.getAll());
    setMenuForm({ name: "", price: "", available: true });
  }

  function startEditMenu(m: MenuItem) {
    setEditingMenuId(m.id);
    setMenuForm({ name: m.name, price: String(m.price), available: !!m.available });
  }

  function saveEditMenu() {
    if (!editingMenuId) return;
    const menus = menuStorage.getAll();
    const idx = menus.findIndex((x) => x.id === editingMenuId);
    if (idx === -1) return;
    menus[idx] = { ...menus[idx], name: menuForm.name, price: Number(menuForm.price), available: menuForm.available } as MenuItem;
    menuStorage.set(menus);
    setAllMenus(menuStorage.getAll());
    setEditingMenuId(null);
    setMenuForm({ name: "", price: "", available: true });
  }

  function deleteMenu(id: string) {
    const menus = menuStorage.getAll().filter((m) => m.id !== id);
    menuStorage.set(menus);
    setAllMenus(menuStorage.getAll());
  }

  if (!seller) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600">Akses penjual</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950">Anda belum login</h1>
          <p className="mt-3 text-sm text-slate-600">Silakan login dulu agar dashboard toko bisa dibuka.</p>
          <a href="/penjual/login" className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Ke halaman login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {/* Header Section */}
      <section className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
              Dashboard Penjual
            </div>
            <h1 className="text-3xl font-bold text-slate-950">
              Selamat datang, {seller.penjual?.businessName || seller.email}
            </h1>
            <p className="mt-2 text-slate-600">Kelola menu, pesanan, dan pantau performa penjualan Anda di sini.</p>
          </div>
          <button
            onClick={() => router.push("/penjual/dashboard/kelolaMenu")}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 w-fit"
          >
            <Plus className="h-4 w-4" /> Tambah Menu
          </button>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Pesanan</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{stats.totalOrders}</p>
            </div>
            <div className="rounded-lg bg-violet-100 p-3">
              <BarChart3 className="h-5 w-5 text-violet-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Menunggu Konfirmasi</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{stats.pending}</p>
            </div>
            <div className="rounded-lg bg-amber-100 p-3">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Selesai</p>
              <p className="mt-2 text-3xl font-bold text-slate-950">{stats.completed}</p>
            </div>
            <div className="rounded-lg bg-emerald-100 p-3">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Pendapatan</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">Rp {(stats.totalIncome / 1000).toLocaleString("id-ID")}K</p>
            </div>
            <div className="rounded-lg bg-cyan-100 p-3">
              <CircleDollarSign className="h-5 w-5 text-cyan-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Chart & Quick Nav */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-600" />
                Tren Pendapatan
              </h2>
              <p className="mt-1 text-sm text-slate-600">Data 7 pesanan selesai terakhir</p>
            </div>
            <button
              onClick={() => router.push("/penjual/dashboard/penjualan")}
              className="text-sm font-medium text-violet-600 hover:text-violet-700 transition flex items-center gap-1"
            >
              Lihat Detail <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <SalesChart data={chartData} />
        </div>

        {/* Quick Navigation */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950 mb-4">Navigasi Cepat</h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/penjual/dashboard/pesanan")}
              className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition group"
            >
              <div className="rounded-lg bg-blue-100 p-2">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-950">Pesanan</p>
                <p className="text-xs text-slate-600">{stats.pending} menunggu</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
            </button>

            <button
              onClick={() => router.push("/penjual/dashboard/kelolaMenu")}
              className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 p-4 text-left hover:border-orange-300 hover:shadow-md transition group"
            >
              <div className="rounded-lg bg-orange-100 p-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-950">Kelola Menu</p>
                <p className="text-xs text-slate-600">{sellerMenus.length} menu aktif</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
            </button>

            <button
              onClick={() => router.push("/penjual/dashboard/penjualan")}
              className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 text-left hover:border-emerald-300 hover:shadow-md transition group"
            >
              <div className="rounded-lg bg-emerald-100 p-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-950">Laporan Penjualan</p>
                <p className="text-xs text-slate-600">Analisis & export</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
            </button>

            <button
              onClick={() => router.push("/penjual/dashboard/profil")}
              className="w-full flex items-center gap-3 rounded-lg bg-linear-to-r from-pink-50 to-rose-50 border border-pink-200 p-4 text-left hover:border-pink-300 hover:shadow-md transition group"
            >
              <div className="rounded-lg bg-pink-100 p-2">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-950">Profil Toko</p>
                <p className="text-xs text-slate-600">Edit informasi</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition" />
            </button>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-100 p-2">
              <Zap className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Menu Aktif</p>
              <p className="text-2xl font-bold text-slate-950">{sellerMenus.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Penjualan Selesai</p>
              <p className="text-2xl font-bold text-slate-950">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-100 p-2">
              <CircleDollarSign className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Rata-rata Per Order</p>
              <p className="text-2xl font-bold text-slate-950">Rp {(stats.avgPerOrder / 1000).toLocaleString("id-ID")}K</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}