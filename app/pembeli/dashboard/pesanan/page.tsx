"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types";
import { orderStorage, userStorage } from "@/lib/storage";
import { Clock, CheckCircle, AlertCircle, Package } from "lucide-react";

export default function PesananPage() {
  const router = useRouter();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "preparing" | "ready">("all");

  useEffect(() => {
    const user = userStorage.get();
    if (!user) {
      router.push("/pembeli/login");
      return;
    }

    const allOrders = orderStorage.getAll();
    const userOrders = allOrders
      .filter((o) => o.userId === user.id)
      .filter((o) => o.status !== "completed" && o.status !== "cancelled")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setActiveOrders(userOrders);
  }, [router]);

  const getStatusInfo = (status: Order["status"]) => {
    const statusMap = {
      pending: { label: "Menunggu Konfirmasi", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { label: "Dikonfirmasi", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      preparing: { label: "Sedang Disiapkan", color: "bg-purple-100 text-purple-800", icon: Package },
      ready: { label: "Siap Diambil", color: "bg-green-100 text-green-800", icon: CheckCircle },
      completed: { label: "Selesai", color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800", icon: AlertCircle },
    };
    return statusMap[status];
  };

  const filteredOrders =
    filter === "all" ? activeOrders : activeOrders.filter((o) => o.status === filter);

  if (activeOrders.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Saya</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-6">Belum ada pesanan aktif</p>
          <button
            onClick={() => router.push("/pembeli/dashboard/menu")}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mulai Pesan Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pesanan Saya</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "pending", "confirmed", "preparing", "ready"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "all"
              ? "Semua"
              : status === "pending"
                ? "Menunggu"
                : status === "confirmed"
                  ? "Dikonfirmasi"
                  : status === "preparing"
                    ? "Disiapkan"
                    : "Siap Diambil"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          return (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">ID Pesanan</p>
                  <p className="text-lg font-bold text-gray-900">{order.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-3">Item Pesanan</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                      <span>
                        {item.name} x{item.qty}
                      </span>
                      <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Catatan</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Pesanan</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Pesanan</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}