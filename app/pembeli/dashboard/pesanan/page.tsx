"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle, AlertCircle, Package, Receipt, CreditCard, XCircle } from "lucide-react";
import { usePembeli } from "@/lib/context/PembeliContext";
import { getBuyerOrdersAction, cancelOrderAction, syncPaymentStatusAction } from "@/app/api/actions";
import Script from "next/script";

export default function PesananPage() {
  const router = useRouter();
  const { pembeliId } = usePembeli();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "PREPARING" | "READY">("ALL");

  useEffect(() => {
    if (!pembeliId) return;

    let cancelled = false;
    const fetchOrders = async () => {
      const res = await getBuyerOrdersAction(pembeliId);
      if (!cancelled && res.success && res.data) {
        // We only show active orders by default, or all depending on design
        // Midtrans "pending" means payment pending. If payment is FAILED, order is CANCELLED.
        const orders = res.data.filter((o: any) => o.status !== "COMPLETED" && o.status !== "CANCELLED");
        setActiveOrders(orders);
      }
      if (!cancelled) setIsLoading(false);
    };

    fetchOrders();
    return () => { cancelled = true; };
  }, [pembeliId]);

  const getStatusInfo = (status: string, paymentStatus: string) => {
    // If payment is still pending, override the status display to "Menunggu Pembayaran"
    if (paymentStatus === "PENDING") {
      return { label: "Menunggu Pembayaran", color: "bg-orange-100 text-orange-800", icon: Receipt };
    }

    const statusMap: Record<string, any> = {
      PENDING: { label: "Menunggu Konfirmasi", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      CONFIRMED: { label: "Dikonfirmasi", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      PREPARING: { label: "Sedang Disiapkan", color: "bg-purple-100 text-purple-800", icon: Package },
      READY: { label: "Siap Diambil", color: "bg-green-100 text-green-800", icon: CheckCircle },
      COMPLETED: { label: "Selesai", color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-800", icon: AlertCircle },
    };
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: Clock };
  };

  const handleResumePayment = (snapToken: string, transactionId: string) => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan. Silakan hubungi admin.");
      return;
    }
    
    (window as any).snap.pay(snapToken, {
      onSuccess: async function () {
        if (transactionId) await syncPaymentStatusAction(transactionId);
        window.location.reload();
      },
      onPending: async function () {
        if (transactionId) await syncPaymentStatusAction(transactionId);
        window.location.reload();
      },
      onError: function () {
        alert("Pembayaran gagal!");
        window.location.reload();
      },
      onClose: function () {
        alert("Anda menutup popup sebelum menyelesaikan pembayaran.");
      },
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;
    
    setIsLoading(true);
    const res = await cancelOrderAction(orderId, "Dibatalkan oleh pembeli sebelum pembayaran");
    if (res.success) {
      alert("Pesanan berhasil dibatalkan.");
      window.location.reload();
    } else {
      alert(res.message || "Gagal membatalkan pesanan");
      setIsLoading(false);
    }
  };

  const filteredOrders =
    filter === "ALL" ? activeOrders : activeOrders.filter((o) => o.status === filter);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <div className="p-6">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Pesanan Saya</h1>
        <div className="rounded-lg border border-gray-100 bg-white p-12 text-center shadow-sm">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="mb-6 text-lg text-gray-500">Belum ada pesanan aktif</p>
          <button
            onClick={() => router.push("/pembeli/dashboard/menu")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Mulai Pesan Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "Mid-client-UKHo83tnCiFKyoDg"}
        strategy="lazyOnload"
      />
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Pesanan Saya</h1>

      {/* Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {["ALL", "PENDING", "CONFIRMED", "PREPARING", "READY"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "ALL"
              ? "Semua"
              : status === "PENDING"
                ? "Menunggu"
                : status === "CONFIRMED"
                  ? "Dikonfirmasi"
                  : status === "PREPARING"
                    ? "Disiapkan"
                    : "Siap Diambil"}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusInfo = getStatusInfo(order.status, order.paymentStatus);
          const StatusIcon = statusInfo.icon;
          return (
            <div
              key={order.id}
              className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm text-gray-500">Kode Transaksi</p>
                  <p className="text-lg font-bold text-gray-900">{order.transactionCode}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">Warung: {order.penjual?.businessName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.color}`}>
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="mb-3 font-semibold text-gray-900">Item Pesanan</h3>
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between border-l-2 border-gray-200 pl-4 text-sm text-gray-600">
                      <span>
                        {item.menu?.name} x{item.quantity}
                      </span>
                      <span>Rp {item.subtotal.toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-1 text-xs font-semibold text-gray-500">Catatan</p>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
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

              {/* Action Buttons */}
              {order.status === "PENDING" && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    <XCircle size={18} />
                    Batalkan
                  </button>

                  {order.paymentStatus === "PENDING" && order.payment?.snapToken && (
                    <button
                      onClick={() => handleResumePayment(order.payment.snapToken, order.payment.transactionId)}
                      className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                    >
                      <CreditCard size={18} />
                      Lanjutkan Pembayaran
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}