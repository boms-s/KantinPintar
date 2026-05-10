"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction, getSellerOrdersAction, updateOrderStatusAction } from "@/app/api/actions";

type OrderItem = { menuId: string; quantity: number; unitPrice: number; subtotal: number };
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

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await getCurrentUserAction();
        if (!userRes.success || userRes.data?.role !== "PENJUAL") {
          router.push("/penjual/login");
          return;
        }
        setSeller(userRes.data);

        const ordersRes = await getSellerOrdersAction(userRes.data.id);
        if (ordersRes.success) {
          setOrders(ordersRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!seller) return <div className="p-6">Silakan login sebagai penjual.</div>;

  async function updateStatus(id: string, status: string) {
    try {
      const res = await updateOrderStatusAction(id, status);
      if (res.success) {
        // Reload orders
        const ordersRes = await getSellerOrdersAction(seller.id);
        if (ordersRes.success) {
          setOrders(ordersRes.data || []);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pesanan</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan untuk toko Anda.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="bg-white p-4 rounded mb-3">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">Order {o.transactionCode}</p>
                <p className="text-sm text-gray-500">{o.items.length} item • Rp {(o.totalPrice||0).toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-400">{o.pembeli?.fullName} • {o.pembeli?.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-semibold">{o.status}</span>
                {o.status === 'PENDING' && (
                  <button onClick={() => updateStatus(o.id, 'CONFIRMED')} className="px-3 py-1 rounded bg-yellow-400 text-white text-sm">Konfirmasi</button>
                )}
                {o.status === 'CONFIRMED' && (
                  <button onClick={() => updateStatus(o.id, 'PREPARING')} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Siapkan</button>
                )}
                {o.status === 'PREPARING' && (
                  <button onClick={() => updateStatus(o.id, 'READY')} className="px-3 py-1 rounded bg-green-500 text-white text-sm">Siap</button>
                )}
                {o.status === 'READY' && (
                  <button onClick={() => updateStatus(o.id, 'COMPLETED')} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Selesai</button>
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <ul>
                {o.items.map((it, idx) => (
                  <li key={idx}>{it.quantity}x — Rp {it.unitPrice.toLocaleString('id-ID')}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
