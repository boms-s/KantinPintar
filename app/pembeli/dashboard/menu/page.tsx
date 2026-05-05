"use client";

import { useEffect, useState } from "react";

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("menus") || "[]");
    setMenus(data);
  }, []);

  const addToCart = (item: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Ditambahkan ke keranjang");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Menu Makanan</h1>

      <div className="grid grid-cols-2 gap-4">
        {menus.map((m) => (
          <div key={m.id} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{m.name}</p>
            <p>Rp {m.price}</p>
            <button
              onClick={() => addToCart(m)}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}