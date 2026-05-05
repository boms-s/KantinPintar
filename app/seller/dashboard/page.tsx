"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Menu = { id: string; name: string; price: number };

type Order = {
  id: string;
  buyerName: string;
  items?: any[];
  total: number;
  status: "pending" | "diproses" | "selesai";
  time?: string;
};

export default function SellerDashboard() {
  const router = useRouter();

  const [seller, setSeller] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [tab, setTab] = useState("orders");

  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
  });

  // 🔐 LOAD DATA (SAFE)
  useEffect(() => {
    const sellerData = localStorage.getItem("currentSeller");
    if (!sellerData) {
      router.replace("/seller/login");
      return;
    }

    setSeller(JSON.parse(sellerData));

    const rawOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const safeOrders = rawOrders.map((o: any) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : [],
    }));

    setOrders(safeOrders);
    setMenus(JSON.parse(localStorage.getItem("menus") || "[]"));
  }, []);

  // 🔄 SYNC ORDERS
  const syncOrders = (data: Order[]) => {
    setOrders(data);
    localStorage.setItem("orders", JSON.stringify(data));
  };

  // 🔄 SYNC MENUS
  const syncMenus = (data: Menu[]) => {
    setMenus(data);
    localStorage.setItem("menus", JSON.stringify(data));
  };

  // 🍽️ ADD MENU
  const addMenu = () => {
    if (!newMenu.name || !newMenu.price) return;

    const updated = [
      ...menus,
      {
        id: crypto.randomUUID(),
        name: newMenu.name,
        price: Number(newMenu.price),
      },
    ];

    syncMenus(updated);
    setNewMenu({ name: "", price: "" });
  };

  // ❌ DELETE MENU
  const deleteMenu = (id: string) => {
    const updated = menus.filter((m) => m.id !== id);
    syncMenus(updated);
  };

  // 🔄 UPDATE STATUS
  const updateStatus = (id: string, status: Order["status"]) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );

    syncOrders(updated);
  };

  // 💰 TOTAL
  const totalIncome = orders
    .filter((o) => o.status === "selesai")
    .reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Penjual</h1>
          <p className="text-gray-600">
            Halo, {seller?.fullName} 👋
          </p>
        </div>
      </div>

      {/* NAV */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab("orders")} className="bg-blue-500 text-white px-3 py-1 rounded">Pesanan</button>
        <button onClick={() => setTab("menu")} className="bg-green-500 text-white px-3 py-1 rounded">Menu</button>
        <button onClick={() => setTab("sales")} className="bg-purple-500 text-white px-3 py-1 rounded">Penjualan</button>
      </div>

      {/* ================= PESANAN ================= */}
      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Pesanan Masuk</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">Belum ada pesanan</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded shadow mb-3">
                <p className="font-bold">{order.buyerName}</p>

                {/* FIX SAFE ITEMS */}
                <ul className="text-sm text-gray-600">
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((i, idx) => (
                      <li key={idx}>
                        {i.name} - Rp {i.price}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">Tidak ada detail item</li>
                  )}
                </ul>

                <p className="mt-1">Total: Rp {order.total}</p>
                <p>Status: {order.status}</p>

                <div className="flex gap-2 mt-2">
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "diproses")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Proses
                    </button>
                  )}

                  {order.status === "diproses" && (
                    <button
                      onClick={() => updateStatus(order.id, "selesai")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Selesai
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= MENU ================= */}
      {tab === "menu" && (
        <div>
          <h2 className="text-xl font-bold mb-4">Kelola Menu</h2>

          <div className="flex gap-2 mb-4">
            <input
              placeholder="Nama"
              value={newMenu.name}
              onChange={(e) =>
                setNewMenu({ ...newMenu, name: e.target.value })
              }
              className="border px-2 py-1"
            />

            <input
              placeholder="Harga"
              type="number"
              value={newMenu.price}
              onChange={(e) =>
                setNewMenu({ ...newMenu, price: e.target.value })
              }
              className="border px-2 py-1"
            />

            <button
              onClick={addMenu}
              className="bg-green-500 text-white px-3"
            >
              Tambah
            </button>
          </div>

          {menus.map((m) => (
            <div key={m.id} className="bg-white p-3 mb-2 flex justify-between">
              <p>{m.name} - Rp {m.price}</p>
              <button
                onClick={() => deleteMenu(m.id)}
                className="text-red-500"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= SALES ================= */}
      {tab === "sales" && (
        <div>
          <h2 className="text-xl font-bold">Penjualan</h2>

          <p className="text-lg font-bold mt-2">
            Total: Rp {totalIncome}
          </p>

          {orders
            .filter((o) => o.status === "selesai")
            .map((o) => (
              <div key={o.id} className="bg-white p-3 mt-2 rounded shadow">
                <p>{o.buyerName}</p>
                <p className="text-sm text-gray-500">
                  {Array.isArray(o.items)
                    ? o.items.map((i) => i.name).join(", ")
                    : "-"}
                </p>
                <p className="font-bold">Rp {o.total}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}