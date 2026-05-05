"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Clock, TrendingUp, Wallet } from "lucide-react";
import { PembeliUser, Order } from "@/lib/types";
import { userStorage, orderStorage, cartStorage } from "@/lib/storage";

interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<PembeliUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const currentUser = userStorage.get();
    if (!currentUser) {
      router.push("/pembeli/login");
      return;
    }
    setUser(currentUser);

    // Calculate stats
    const allOrders = orderStorage.getAll();
    const userOrders = allOrders.filter((o) => o.userId === currentUser.id);
    const completedOrders = userOrders.filter((o) => o.status === "completed");
    const pendingOrders = userOrders.filter(
      (o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
    );

    const totalSpent = completedOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    setStats({
      totalOrders: userOrders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      totalSpent,
    });

    // Get recent orders (last 3)
    setRecentOrders(userOrders.slice(-3).reverse());
  }, [router]);

  const cartCount = cartStorage.getTotalQty();

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: React.ComponentType<{ size: number }>;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Selamat datang, {user?.fullName}! 👋</h1>
        <p className="text-gray-500 mt-2">Berikut adalah overview kebutuhan Anda sebagai pembeli</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ShoppingBag} label="Total Pesanan" value={stats.totalOrders} color="bg-blue-600" />
        <StatCard
          icon={Clock}
          label="Pesanan Menunggu"
          value={stats.pendingOrders}
          color="bg-yellow-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Pesanan Selesai"
          value={stats.completedOrders}
          color="bg-green-600"
        />
        <StatCard
          icon={Wallet}
          label="Total Pengeluaran"
          value={`Rp ${stats.totalSpent.toLocaleString("id-ID")}`}
          color="bg-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">Lihat Menu Makanan</h3>
          <p className="text-blue-100 mb-4">Jelajahi pilihan menu dari berbagai penjual favorit Anda</p>
          <button
            onClick={() => router.push("/pembeli/dashboard/menu")}
            className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Mulai Pesan →
          </button>
        </div>

        {cartCount > 0 && (
          <div className="bg-linear-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">Keranjang Anda</h3>
            <p className="text-green-100 mb-4">Anda memiliki {cartCount} item di keranjang</p>
            <button
              onClick={() => router.push("/pembeli/dashboard/keranjang")}
              className="bg-white text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Lihat Keranjang →
            </button>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pesanan Terbaru</h2>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada pesanan. Mulai pesan sekarang!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID Pesanan</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Jumlah Item</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id.slice(0, 8)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.items.length} item</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status === "completed"
                          ? "Selesai"
                          : order.status === "pending"
                            ? "Menunggu"
                            : order.status === "confirmed"
                              ? "Dikonfirmasi"
                              : order.status === "preparing"
                                ? "Sedang Disiapkan"
                                : order.status === "ready"
                                  ? "Siap Diambil"
                                  : "Dibatalkan"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={() => router.push("/pembeli/dashboard/pesanan")}
          className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
        >
          Lihat semua pesanan →
        </button>
      </div>
    </div>
  );
}