"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Edit2, Trash2, ShoppingCart, TrendingUp, Users, Home } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<{ fullName?: string; email?: string; role?: string } | null>(null);
  const [currentTab, setCurrentTab] = useState<"overview" | "menu" | "orders" | "settings">("overview");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: "",
    category: "makanan",
    price: 0,
    description: "",
  });

  const router = useRouter();

  useEffect(() => {
    try {
      const adminData = localStorage.getItem("currentAdmin");
      if (!adminData) {
        router.push("/login");
        return;
      }
      setAdmin(JSON.parse(adminData));

      // Load menu items from localStorage
      const storedMenu = localStorage.getItem("menuItems");
      if (storedMenu) {
        setMenuItems(JSON.parse(storedMenu));
      }
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("currentAdmin");
    } catch (err) {
      console.error(err);
    }
    router.push("/admin/login");
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      ...newMenu,
      price: parseFloat(newMenu.price.toString()),
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="w-full px-10 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md h-fit sticky top-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white font-bold">
                🔐
              </div>
              <div>
                <div className="font-bold">ADMIN PANEL</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Kantin Pintar</div>
              </div>
            </div>

            <nav className="space-y-2 mb-8">
              <button
                onClick={() => setCurrentTab("overview")}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  currentTab === "overview"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <TrendingUp size={18} />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentTab("menu")}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  currentTab === "menu"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ShoppingCart size={18} />
                Kelola Menu
              </button>
              <button
                onClick={() => setCurrentTab("orders")}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  currentTab === "orders"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ShoppingCart size={18} />
                Pesanan
              </button>
              <button
                onClick={() => setCurrentTab("settings")}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                  currentTab === "settings"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users size={18} />
                Pengaturan
              </button>
            </nav>

            <hr className="border-gray-200 dark:border-gray-700 mb-4" />

            <div className="space-y-2">
              <Link
                href="/"
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition"
              >
                <Home size={18} />
                Beranda
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-8">
              <h1 className="text-3xl font-bold mb-2">Selamat datang, {admin?.fullName}!</h1>
              <p className="text-gray-600 dark:text-gray-400">{admin?.email}</p>
            </div>

            {/* Overview Tab */}
            {currentTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Total Menu</p>
                        <p className="text-3xl font-bold mt-2">{menuItems.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="text-blue-600" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Total Pesanan</p>
                        <p className="text-3xl font-bold mt-2">0</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="text-green-600" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Total Pengguna</p>
                        <p className="text-3xl font-bold mt-2">0</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <Users className="text-red-600" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                  <h2 className="text-xl font-bold mb-4">Informasi Sistem</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <span className="font-semibold text-green-600">✓ Aktif</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Versi Aplikasi</span>
                      <span className="font-semibold">v1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Role Akun</span>
                      <span className="font-semibold">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Management Tab */}
            {currentTab === "menu" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Kelola Menu Makanan</h2>
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition"
                  >
                    <Plus size={20} />
                    Tambah Menu
                  </button>
                </div>

                {/* Add Menu Form */}
                {showAddMenu && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                    <h3 className="text-lg font-bold mb-4">Tambah Menu Baru</h3>
                    <form onSubmit={handleAddMenu} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2">Nama Menu</label>
                          <input
                            type="text"
                            value={newMenu.name}
                            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                            placeholder="Contoh: Nasi Goreng"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Kategori</label>
                          <select
                            value={newMenu.category}
                            onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                          >
                            <option value="makanan">Makanan</option>
                            <option value="minuman">Minuman</option>
                            <option value="dessert">Dessert</option>
                            <option value="snack">Snack</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Harga (Rp)</label>
                          <input
                            type="number"
                            value={newMenu.price}
                            onChange={(e) => setNewMenu({ ...newMenu, price: parseInt(e.target.value) })}
                            placeholder="15000"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold mb-2">Deskripsi Singkat</label>
                          <input
                            type="text"
                            value={newMenu.description}
                            onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                            placeholder="Contoh: Nasi goreng dengan telur dan sayuran"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                          Simpan Menu
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddMenu(false)}
                          className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-6 py-2 rounded-lg transition"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Menu List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                      <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Kategori</span>
                          <span className="font-semibold capitalize">{item.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Harga</span>
                          <span className="font-bold text-red-600">Rp {item.price.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition">
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(item.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {menuItems.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-md text-center">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Belum ada menu. Mulai dengan menambahkan menu baru.</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {currentTab === "orders" && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Pesanan</h2>
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">Belum ada pesanan untuk ditampilkan.</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {currentTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold mb-6">Pengaturan Admin</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        defaultValue={admin?.fullName}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ubah di file: lib/adminCredentials.ts</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Admin</label>
                      <input
                        type="email"
                        defaultValue={admin?.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ubah di file: lib/adminCredentials.ts</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold mb-2">💡 Tips Mengubah Kredensial Admin</p>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Untuk mengubah email dan password admin, buka file <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">lib/adminCredentials.ts</code> dan ubah nilai di dalam object <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">ADMIN_CREDENTIALS</code>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-bold mb-4">Keamanan</h3>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition">
                    Logout Semua Sesi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
