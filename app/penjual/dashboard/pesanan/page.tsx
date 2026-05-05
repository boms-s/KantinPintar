"use client";

import { useEffect, useState } from "react";
import { penjual as PenjualType } from "@/lib/types";
import { penjualSession, orderStorage } from "@/lib/storage";

type OrderItem = { penjualId?: string; name?: string; price?: number; qty?: number };
type SellerOrder = { id: string; items: OrderItem[]; totalPrice?: number; status?: string; createdAt?: string };

export default function PesananPage() {
  const seller: PenjualType | null = penjualSession.get();
  const [orders, setOrders] = useState<SellerOrder[]>(() => orderStorage.getAll());

  useEffect(() => {
    const handler = () => setOrders(orderStorage.getAll());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!seller) return <div className="p-6">Silakan login sebagai penjual.</div>;

  const sellerOrders = orders.filter((o) => Array.isArray(o.items) && o.items.some((it) => it.penjualId === seller.id));

  function updateStatus(id: string, status: string) {
    orderStorage.update(id, { status });
    setOrders(orderStorage.getAll());
    // trigger storage event for other components
    try { window.dispatchEvent(new Event('storage')); } catch {}
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pesanan</h1>
      {sellerOrders.length === 0 ? (
        <p className="text-gray-500">Belum ada pesanan untuk toko Anda.</p>
      ) : (
        sellerOrders.map((o) => (
          <div key={o.id} className="bg-white p-4 rounded mb-3">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">Order {o.id}</p>
                <p className="text-sm text-gray-500">{o.items.length} item • Rp {(o.totalPrice||0).toLocaleString('id-ID')}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{o.status}</span>
                {o.status === 'pending' && (
                  <button onClick={() => updateStatus(o.id, 'diproses')} className="px-3 py-1 rounded bg-yellow-400 text-white">Proses</button>
                )}
                {o.status === 'diproses' && (
                  <button onClick={() => updateStatus(o.id, 'selesai')} className="px-3 py-1 rounded bg-green-600 text-white">Selesai</button>
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <ul>
                {o.items.map((it, idx) => (
                  <li key={idx}>{it.name} ×{it.qty || 1} — Rp {it.price}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
