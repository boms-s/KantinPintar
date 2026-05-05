"use client";

import { useEffect, useState } from "react";

export default function RiwayatPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]");
    setHistory(data);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Riwayat Pesanan</h1>

      {history.length === 0 ? (
        <p>Belum ada riwayat</p>
      ) : (
        history.map((item, i) => (
          <div key={i} className="border p-3 mb-2 rounded">
            {item.name} - Rp {item.price}
          </div>
        ))
      )}
    </div>
  );
}