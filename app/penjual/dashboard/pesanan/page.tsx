"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction, getSellerOrdersAction, updateOrderStatusAction } from "@/app/api/actions";
import { Clock, CheckCircle, Package, ChefHat, User, ReceiptText, RefreshCw } from "lucide-react";

type OrderItem = { menuId: string; quantity: number; unitPrice: number; subtotal: number; menu?: { name: string } };
type Order = { 
  id: string; 
  transactionCode: string;
  items: OrderItem[]; 
  totalPrice: number; 
  status: string;
  createdAt: string;
  pembeli?: { fullName: string; phone: string };
};

export default function PesananPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const userRes = await getCurrentUserAction();
      if (!userRes.success || userRes.data?.role !== "PENJUAL") {
        router.push("/penjual/login");
        return;
      }
      setSeller(userRes.data);

      const penjualId = userRes.data.penjual?.id;
      if (!penjualId) return;

      const ordersRes = await getSellerOrdersAction(penjualId);
      if (ordersRes.success) {
        // Filter out CANCELLED orders from active view, or keep them if preferred
        setOrders(ordersRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [router]);

  async function updateStatus(id: string, status: string) {
    if (updatingId) return;
    setUpdatingId(id);
    try {
      const res = await updateOrderStatusAction(id, status);
      if (res.success) {
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200"><Clock size={14} /> Menunggu Pembayaran</span>;
      case "CONFIRMED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200"><CheckCircle size={14} /> Pesanan Baru</span>;
      case "PREPARING":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200"><ChefHat size={14} /> Sedang Disiapkan</span>;
      case "READY":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 border border-indigo-200"><Package size={14} /> Siap Diambil</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200"><CheckCircle size={14} /> Selesai</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 border border-red-200"><CheckCircle size={14} /> Dibatalkan</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{status}</span>;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  if (!seller) return null;

  // Group orders: Active vs Completed
  const activeOrders = orders.filter((o) => !["COMPLETED", "CANCELLED", "PENDING"].includes(o.status));
  // Notice we hide PENDING (waiting for payment) from seller's active queue, they only see CONFIRMED and beyond. 
  // If cash on delivery is supported, PENDING can be shown. For now, let's show PENDING but separately or at the bottom.
  const pendingPaymentOrders = orders.filter((o) => o.status === "PENDING");
  const pastOrders = orders.filter((o) => ["COMPLETED", "CANCELLED"].includes(o.status));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kelola Pesanan</h1>
          <p className="text-slate-500 mt-1">Pantau dan kelola pesanan masuk secara real-time.</p>
        </div>
        <button 
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Segarkan
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <ReceiptText size={40} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Pesanan</h2>
          <p className="text-slate-500 max-w-md mx-auto">Toko Anda belum menerima pesanan apapun. Tetap online agar pembeli dapat memesan menu Anda.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Active Orders Section */}
          {activeOrders.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Pesanan Aktif <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2">{activeOrders.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeOrders.map((o) => (
                  <OrderCard 
                    key={o.id} 
                    order={o} 
                    updateStatus={updateStatus} 
                    updatingId={updatingId} 
                    badge={getStatusBadge(o.status)} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Pending Payment Section (Optional, nice to have for visibility) */}
          {pendingPaymentOrders.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 text-opacity-80">
                Menunggu Pembayaran <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ml-2">{pendingPaymentOrders.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-75 grayscale-[20%]">
                {pendingPaymentOrders.map((o) => (
                  <OrderCard 
                    key={o.id} 
                    order={o} 
                    updateStatus={updateStatus} 
                    updatingId={updatingId} 
                    badge={getStatusBadge(o.status)} 
                    readonly 
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past Orders Section */}
          {pastOrders.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 mt-12 pt-8 border-t border-slate-200">
                Riwayat Pesanan Hari Ini
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-80">
                {pastOrders.map((o) => (
                  <div key={o.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                        <ReceiptText className="text-slate-400" size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{o.transactionCode}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{o.pembeli?.fullName} • Rp {o.totalPrice.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                    <div>{getStatusBadge(o.status)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}

// Sub-component for clean order cards
function OrderCard({ order, updateStatus, updatingId, badge, readonly = false }: any) {
  const isUpdating = updatingId === order.id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-slate-200 relative group">
      {/* Decorative top border based on status */}
      <div className={`h-1.5 w-full ${
        order.status === 'CONFIRMED' ? 'bg-amber-400' : 
        order.status === 'PREPARING' ? 'bg-blue-500' : 
        order.status === 'READY' ? 'bg-indigo-500' : 'bg-slate-200'
      }`} />
      
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-slate-400 mb-1 uppercase">Order ID</p>
            <p className="font-bold text-slate-900">{order.transactionCode}</p>
          </div>
          <div>{badge}</div>
        </div>

        {/* Customer Info */}
        <div className="bg-slate-50 rounded-lg p-3 mb-5 border border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 shrink-0">
            <User size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{order.pembeli?.fullName || "Pelanggan"}</p>
            <p className="text-xs text-slate-500 truncate">{order.pembeli?.phone || "-"}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wide">Daftar Menu ({order.items.length})</p>
          <ul className="space-y-2 mb-4">
            {order.items.map((it: any, idx: number) => (
              <li key={idx} className="flex justify-between items-start text-sm">
                <span className="text-slate-700">
                  <span className="font-semibold text-slate-900 mr-2">{it.quantity}x</span>
                  {it.menu?.name || "Menu Item"}
                </span>
                <span className="text-slate-500 tabular-nums whitespace-nowrap ml-4 text-xs font-medium">Rp {it.subtotal.toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total & Action */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-500 font-medium">Total Pembayaran</span>
            <span className="text-lg font-black text-slate-900">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
          </div>

          {!readonly && (
            <div className="flex gap-2">
              {order.status === 'CONFIRMED' && (
                <button 
                  disabled={isUpdating}
                  onClick={() => updateStatus(order.id, 'PREPARING')} 
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {isUpdating ? "Memproses..." : "Mulai Siapkan"}
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button 
                  disabled={isUpdating}
                  onClick={() => updateStatus(order.id, 'READY')} 
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {isUpdating ? "Memproses..." : "Tandai Siap Ambil"}
                </button>
              )}
              {order.status === 'READY' && (
                <button 
                  disabled={isUpdating}
                  onClick={() => updateStatus(order.id, 'COMPLETED')} 
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-wait"
                >
                  {isUpdating ? "Memproses..." : "Selesaikan Pesanan"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
