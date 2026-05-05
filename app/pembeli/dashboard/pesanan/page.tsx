"use client";

import { useEffect, useState } from "react";

export default function PesananPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(data);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <p>Belum ada pesanan</p>
      ) : (
        orders.map((item, i) => (
          <div key={i} className="border p-3 mb-2 rounded">
            {item.name} - Rp {item.price}
          </div>
        ))
      )}
    </div>
  );
}