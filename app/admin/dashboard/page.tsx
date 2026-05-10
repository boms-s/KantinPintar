"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, Home, LayoutGrid, LogOut, Plus, Shield, ShoppingCart, Trash2, Users } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

type TabKey = "overview" | "menu" | "orders" | "settings";

export default function AdminDashboardPage() {
  const router = useRouter();
  const admin = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        const adminData = localStorage.getItem("currentAdmin");
        return adminData ? (JSON.parse(adminData) as { fullName?: string; email?: string; role?: string }) : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    () => null,
  );
  const [currentTab, setCurrentTab] = useState<TabKey>("overview");
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const storedMenu = localStorage.getItem("menuItems");
      return storedMenu ? (JSON.parse(storedMenu) as MenuItem[]) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: "",
    category: "makanan",
    price: 0,
    description: "",
  });

  useEffect(() => {
    if (!admin) {
      router.replace("/admin/login");
    }
  }, [admin, router]);

  const metrics = useMemo(
    () => [
      { label: "Total Menu", value: menuItems.length, icon: ShoppingCart, tone: "bg-violet-600" },
      { label: "Total Pesanan", value: 0, icon: BarChart3, tone: "bg-emerald-600" },
      { label: "Total Pengguna", value: 0, icon: Users, tone: "bg-sky-600" },
      { label: "Status Sistem", value: "Aktif", icon: Shield, tone: "bg-slate-900" },
    ],
    [menuItems.length],
  );

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentAdmin");
    } catch (error) {
      console.error(error);
    }
    router.push("/admin/login");
  };

  const handleAddMenu = (event: React.FormEvent) => {
    event.preventDefault();

    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      ...newMenu,
      price: Number(newMenu.price),
    };

    const updatedMenu = [...menuItems, newMenuItem];
    setMenuItems(updatedMenu);
    localStorage.setItem("menuItems", JSON.stringify(updatedMenu));
    setNewMenu({ name: "", category: "makanan", price: 0, description: "" });
    setShowAddMenu(false);
  };

  const handleDeleteMenu = (id: string) => {
    const updatedMenu = menuItems.filter((item) => item.id !== id);
    setMenuItems(updatedMenu);
    localStorage.setItem("menuItems", JSON.stringify(updatedMenu));
  };

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_80px_-40px_rgba(15,23,42,0.6)] dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-600">Admin console</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">Memuat dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.08),transparent_30%),linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_32%,rgba(241,245,249,1)_100%)] px-4 py-6 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.14),transparent_30%),linear-gradient(180deg,rgba(15,23,42,1)_0%,rgba(2,6,23,1)_100%)] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="sticky top-6 h-fit rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_52px_-36px_rgba(15,23,42,0.5)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex items-center gap-3 rounded-3xl border border-red-100 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-600 dark:text-red-200">Admin panel</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Kantin Pintar</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {[
              ["overview", "Dashboard", Home],
              ["menu", "Kelola Menu", LayoutGrid],
              ["orders", "Pesanan", ShoppingCart],
              ["settings", "Pengaturan", Users],
            ].map(([key, label, Icon]) => (
              <button
                key={key as string}
                onClick={() => setCurrentTab(key as TabKey)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  currentTab === key
                    ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <Icon size={18} />
                <span>{label as string}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white">
              <Home size={18} /> Beranda
            </Link>
            <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-36px_rgba(15,23,42,0.5)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <p className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">Dashboard admin</p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">Selamat datang, {admin?.fullName}.</h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">Monitor sistem, menu, dan pengaturan operasional dari satu konsol yang lebih terstruktur.</p>
              </div>
              <button onClick={() => setCurrentTab("menu")} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                Tambah menu <Plus size={18} />
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
                  </div>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tone} text-white shadow-lg`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {currentTab === "overview" && (
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.95fr]">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Informasi sistem</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-300">Aktif</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-500 dark:text-slate-400">Versi aplikasi</span>
                    <span className="font-semibold">v1.0.0</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-slate-500 dark:text-slate-400">Role akun</span>
                    <span className="font-semibold">Administrator</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Ringkasan menu</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Data menu yang tersimpan di localStorage untuk sementara.</p>
                <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                  <ShoppingCart className="mx-auto h-10 w-10 text-slate-400" />
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{menuItems.length} menu terdaftar di sistem.</p>
                </div>
              </div>
            </section>
          )}

          {currentTab === "menu" && (
            <section className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Kelola menu makanan</h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tambahkan menu baru dan kelola data yang sudah ada.</p>
                  </div>
                  <button onClick={() => setShowAddMenu(!showAddMenu)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                    <Plus size={18} /> Tambah menu
                  </button>
                </div>

                {showAddMenu && (
                  <form onSubmit={handleAddMenu} className="mt-6 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} placeholder="Nama menu" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white" required />
                      <select value={newMenu.category} onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white">
                        <option value="makanan">Makanan</option>
                        <option value="minuman">Minuman</option>
                        <option value="dessert">Dessert</option>
                        <option value="snack">Snack</option>
                      </select>
                      <input type="number" value={newMenu.price} onChange={(e) => setNewMenu({ ...newMenu, price: parseInt(e.target.value) || 0 })} placeholder="Harga" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white" required />
                      <input value={newMenu.description} onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })} placeholder="Deskripsi singkat" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Simpan menu</button>
                      <button type="button" onClick={() => setShowAddMenu(false)} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">Batal</button>
                    </div>
                  </form>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-slate-950 dark:text-white">{item.name}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item.category}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Harga</span>
                      <span className="font-semibold text-red-600">Rp {item.price.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        <LayoutGrid size={16} /> Edit
                      </button>
                      <button onClick={() => handleDeleteMenu(item.id)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                        <Trash2 size={16} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentTab === "orders" && (
            <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Pesanan</h2>
              <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <ShoppingCart className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Belum ada pesanan untuk ditampilkan.</p>
              </div>
            </section>
          )}

          {currentTab === "settings" && (
            <section className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_52px_-32px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/80">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Pengaturan admin</h2>
                <div className="mt-5 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nama Lengkap</label>
                    <input defaultValue={admin?.fullName} disabled className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Ubah dari file lib/adminCredentials.ts jika diperlukan.</p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email Admin</label>
                    <input defaultValue={admin?.email} disabled className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" />
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 dark:border-red-500/20 dark:bg-red-500/10">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-200">Keamanan</h3>
                <p className="mt-2 text-sm leading-6 text-red-700/90 dark:text-red-100/90">Logout akan menghapus kredensial admin dari browser ini.</p>
                <button onClick={handleLogout} className="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}