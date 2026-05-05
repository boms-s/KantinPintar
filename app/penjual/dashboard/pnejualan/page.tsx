"use client";

import { useMemo, useState } from "react";
import { penjual as PenjualType } from "@/lib/types";
import { penjualSession, orderStorage } from "@/lib/storage";

type OrderItem = { penjualId?: string; name?: string; price?: number; qty?: number };
type SellerOrder = { id: string; items: OrderItem[]; totalPrice?: number; status?: string; createdAt?: string };

export default function PenjualanPage() {
  const seller: PenjualType | null = penjualSession.get();
  const [orders] = useState<SellerOrder[]>(() => orderStorage.getAll());

  if (!seller) return <div className="p-6">Silakan login sebagai penjual.</div>;

  const sellerOrders = useMemo(() => orders.filter(o => Array.isArray(o.items) && o.items.some(it => it.penjualId === seller.id)), [orders, seller]);
  const completed = sellerOrders.filter(o => o.status === 'completed' || o.status === 'selesai');
  const totalIncome = completed.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Penjualan</h1>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-sm text-gray-500">Total Pendapatan</p>
        <p className="text-2xl font-bold">Rp {totalIncome.toLocaleString('id-ID')}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Transaksi Selesai</h2>
      {completed.length === 0 ? (
        <p className="text-gray-500">Belum ada penjualan selesai.</p>
      ) : (
        completed.map(o => (
          <div key={o.id} className="bg-white p-3 rounded mb-2">
            <p className="font-medium">Order {o.id} — Rp {(o.totalPrice||0).toLocaleString('id-ID')}</p>
          </div>
        ))
      )}
    </div>
  );
}
