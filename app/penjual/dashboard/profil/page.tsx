"use client";

import { penjual as PenjualType } from "@/lib/types";
import { penjualSession } from "@/lib/storage";

export default function ProfilPage() {
  const seller: PenjualType | null = penjualSession.get();

  if (!seller) return <div className="p-6">Silakan login sebagai penjual.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Penjual</h1>
      <div className="bg-white p-4 rounded shadow">
        <p className="font-semibold">Nama: {seller.fullName || (seller as { name?: string }).name}</p>
        <p className="text-sm text-gray-500">Email: {seller.email || '-'}</p>
        <p className="text-sm text-gray-500">Role: {seller.role || 'penjual'}</p>
      </div>
    </div>
  );
}
