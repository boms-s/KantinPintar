"use client";

import { useEffect, useState } from "react";

export default function KeranjangPage() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const checkout = () => {
    localStorage.setItem("orders", JSON.stringify(cart));
    localStorage.removeItem("cart");
    alert("Pesanan dibuat!");
    location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Keranjang</h1>

      {cart.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        <>
          {cart.map((item, i) => (
            <div key={i} className="border p-3 mb-2 rounded">
              {item.name} - Rp {item.price}
            </div>
          ))}

          <button
            onClick={checkout}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}