"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types";
import { orderStorage, userStorage } from "@/lib/storage";
import { CheckCircle, XCircle } from "lucide-react";

export default function RiwayatPage() {
  const router = useRouter();
  const [history, setHistory] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"completed" | "cancelled">("completed");

  useEffect(() => {
    const user = userStorage.get();
    if (!user) {
      router.push("/pembeli/login");
      return;
    }

    const allOrders = orderStorage.getAll();
    const userHistory = allOrders
      .filter((o) => o.userId === user.id)
      .filter((o) => o.status === "completed" || o.status === "cancelled")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setHistory(userHistory);
  }, [router]);

  const filteredHistory = history.filter((o) => o.status === filter);

  if (history.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Pesanan</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <CheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">Belum ada riwayat pesanan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Riwayat Pesanan</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {["completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "completed" ? "Selesai" : "Dibatalkan"}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">Tidak ada pesanan {filter === "completed" ? "yang selesai" : "yang dibatalkan"}</p>
          </div>
        ) : (
          filteredHistory.map((order) => (
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
                <div>
                  {order.status === "completed" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      <CheckCircle size={14} />
                      Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      <XCircle size={14} />
                      Dibatalkan
                    </span>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Jumlah Item</p>
                  <p className="text-lg font-bold text-gray-900">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Tanggal</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Total</p>
                  <p className="text-lg font-bold text-blue-600">
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Item Pesanan:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.name} x{item.qty} - Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}