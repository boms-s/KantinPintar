"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { usePembeli } from "@/lib/context/PembeliContext";
import { getBuyerOrdersAction } from "@/app/api/actions";

export default function RiwayatPage() {
  const router = useRouter();
  const { pembeliId } = usePembeli();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "CANCELLED">("ALL");

  useEffect(() => {
    if (!pembeliId) return;

    let cancelled = false;
    const fetchOrders = async () => {
      const res = await getBuyerOrdersAction(pembeliId);
      if (!cancelled && res.success && res.data) {
        // Filter out only completed or cancelled orders
        const pastOrders = res.data.filter((o: any) => o.status === "COMPLETED" || o.status === "CANCELLED");
        setHistory(pastOrders);
      }
      if (!cancelled) setIsLoading(false);
    };

    fetchOrders();
    return () => { cancelled = true; };
  }, [pembeliId]);

  const filteredHistory = filter === "ALL" ? history : history.filter((o) => o.status === filter);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

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
        {["ALL", "COMPLETED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "ALL" ? "Semua" : status === "COMPLETED" ? "Selesai" : "Dibatalkan"}
          </button>
        ))}
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">Tidak ada riwayat untuk filter yang dipilih</p>
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
                  <p className="text-sm text-gray-500">Kode Transaksi</p>
                  <p className="text-lg font-bold text-gray-900">{order.transactionCode}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">Warung: {order.penjual?.businessName}</p>
                </div>
                <div>
                  {order.status === "COMPLETED" ? (
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
                  <p className="text-lg font-bold text-gray-900">
                    {order.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">Tanggal</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
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
                  {order.items?.map((item: any) => (
                    <p key={item.id}>
                      {item.menu?.name} x{item.quantity} - Rp {item.subtotal.toLocaleString("id-ID")}
                    </p>
                  ))}
                </div>
              </div>

              {/* Notes or Reason for Cancellation */}
              {order.notes && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold text-gray-500">Catatan / Alasan Batal</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}