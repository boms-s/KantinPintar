"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { MenuItem } from "@/lib/types";
import { menuStorage, orderStorage, penjualSession } from "@/lib/storage";
import SalesChart from "@/components/penjual/SalesChart";
import { BarChart2 } from "lucide-react";

type OrderItem = { penjualId?: string; name?: string; price?: number; qty?: number };

type SellerOrder = {
  id: string;
  items: OrderItem[];
  totalPrice?: number;
  status?: string;
  createdAt?: string;
};

export default function PenjualDashboard() {
  const router = useRouter();

  const seller = penjualSession.get();
  const allOrders: SellerOrder[] = orderStorage.getAll();
  const [allMenus, setAllMenus] = useState<MenuItem[]>(() => menuStorage.getAll());
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "menu" | "sales" | "profil">("overview");

  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState({ name: "", price: "", available: true });

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
    return { totalOrders, completed, pending, totalIncome };
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
      penjualName: seller.fullName || (seller as { name?: string }).name || "",
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
      <div className="p-6">
        <p className="text-red-500">Anda belum login sebagai penjual. Silakan login di <a className="text-blue-600" href="/penjual/login">/penjual/login</a></p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Penjual</h1>
          <p className="text-gray-600">Halo, {seller.fullName} — kelola tokomu di sini.</p>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div style={{ background: 'linear-gradient(90deg,#7c3aed,#4f46e5)' }} className="text-white p-4 rounded shadow flex items-center gap-3">
          <div className="p-2 bg-white bg-opacity-10 rounded">
            <BarChart2 size={20} />
          </div>
          <div>
            <p className="text-xs opacity-90">Total Pesanan</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Menunggu</p>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Selesai</p>
          <p className="text-2xl font-bold">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Pendapatan</p>
          <p className="text-2xl font-bold">Rp {stats.totalIncome.toLocaleString("id-ID")}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <SalesChart data={chartData} />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveTab("overview")} className={`px-3 py-1 rounded ${activeTab === "overview" ? "bg-blue-600 text-white" : "bg-white"}`}>Overview</button>
        <button onClick={() => setActiveTab("orders")} className={`px-3 py-1 rounded ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-white"}`}>Pesanan</button>
        <button onClick={() => setActiveTab("menu")} className={`px-3 py-1 rounded ${activeTab === "menu" ? "bg-blue-600 text-white" : "bg-white"}`}>Kelola Menu</button>
        <button onClick={() => setActiveTab("sales")} className={`px-3 py-1 rounded ${activeTab === "sales" ? "bg-blue-600 text-white" : "bg-white"}`}>Penjualan</button>
        <button onClick={() => setActiveTab("profil")} className={`px-3 py-1 rounded ${activeTab === "profil" ? "bg-blue-600 text-white" : "bg-white"}`}>Profil</button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pesanan Masuk</h2>
          {sellerOrders.length === 0 ? (
            <p className="text-gray-500">Belum ada pesanan untuk toko Anda.</p>
          ) : (
            sellerOrders.map((o) => (
              <div key={o.id} className="bg-white p-4 rounded mb-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">Order {o.id}</p>
                    <p className="text-sm text-gray-500">{o.items.length} item • Rp {(o.totalPrice||0).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="text-sm text-gray-600">{o.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === "menu" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Kelola Menu Toko</h2>

          <div className="bg-white p-4 rounded mb-6">
            <h3 className="font-semibold mb-2">Tambah / Edit Menu</h3>
            <div className="flex gap-2 flex-wrap">
              <input placeholder="Nama" value={menuForm.name} onChange={(e)=>setMenuForm({...menuForm, name: e.target.value})} className="border px-2 py-1" />
              <input placeholder="Harga" value={menuForm.price} onChange={(e)=>setMenuForm({...menuForm, price: e.target.value})} className="border px-2 py-1" />
              <label className="flex items-center gap-2"><input type="checkbox" checked={menuForm.available} onChange={(e)=>setMenuForm({...menuForm, available: e.target.checked})} /> Tersedia</label>
              {editingMenuId ? (
                <>
                  <button onClick={saveEditMenu} className="bg-green-600 text-white px-3 py-1 rounded">Simpan</button>
                  <button onClick={()=>{setEditingMenuId(null); setMenuForm({name:'', price:'', available:true})}} className="px-3 py-1 rounded border">Batal</button>
                </>
              ) : (
                <button onClick={saveNewMenu} className="bg-blue-600 text-white px-3 py-1 rounded">Tambah Menu</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellerMenus.map((m) => (
              <div key={m.id} className="bg-white p-4 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-gray-500">Rp {m.price.toLocaleString("id-ID")} • {m.available ? 'Tersedia' : 'Habis'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>startEditMenu(m)} className="px-3 py-1 rounded border">Edit</button>
                  <button onClick={()=>deleteMenu(m.id)} className="px-3 py-1 rounded text-red-600 border">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === "sales" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Penjualan</h2>
          <p className="mb-4">Total pendapatan: Rp {stats.totalIncome.toLocaleString("id-ID")}</p>
          {sellerOrders.filter(o=>o.status==='completed' || o.status==='selesai').map(o=> (
            <div key={o.id} className="bg-white p-3 rounded mb-2">
              <p className="font-medium">Order {o.id} — Rp {(o.totalPrice||0).toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Profil Tab */}
      {activeTab === "profil" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Profil Penjual</h2>
          <div className="bg-white p-4 rounded shadow">
            <p className="font-semibold">Nama: {seller.fullName || (seller as { name?: string }).name}</p>
            <p className="text-sm text-gray-500">Email: {seller.email || '-'}</p>
            <p className="text-sm text-gray-500">Role: {seller.role || 'penjual'}</p>
            <div className="mt-4">
              <button onClick={() => { localStorage.removeItem('sk_current_penjual'); router.push('/penjual/login'); }} className="px-3 py-1 rounded bg-red-600 text-white">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}