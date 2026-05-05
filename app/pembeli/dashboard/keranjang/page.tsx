"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { CartItem } from "@/lib/types";
import { cartStorage, userStorage, orderStorage } from "@/lib/storage";
import Image from "next/image";

export default function KeranjangPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>(() => cartStorage.getAll());
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const handler = () => setCart(cartStorage.getAll());
    window.addEventListener("sk_cart_updated", handler);
    return () => window.removeEventListener("sk_cart_updated", handler);
  }, []);

  const handleUpdateQty = (itemId: string, newQty: number) => {
    cartStorage.updateQty(itemId, newQty);
    setCart(cartStorage.getAll());
  };

  const handleRemoveItem = (itemId: string) => {
    cartStorage.remove(itemId);
    setCart(cartStorage.getAll());
  };

  const handleCheckout = () => {
    const user = userStorage.get();
    if (!user) {
      router.push("/pembeli/login");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      items: cart,
      totalPrice: cartStorage.getTotalPrice(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      notes,
    };

    orderStorage.add(order);
    cartStorage.clear();
    setCart([]);

    alert("Pesanan berhasil dibuat!");
    router.push("/pembeli/dashboard/pesanan");
  };

  const totalPrice = cartStorage.getTotalPrice();
  const totalQty = cartStorage.getTotalQty();

  if (cart.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Saya</h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-6">Keranjang Anda kosong</p>
          <button
            onClick={() => router.push("/pembeli/dashboard/menu")}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lanjut Berbelanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Saya</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600">
                {totalQty} item dalam keranjang
              </p>
            </div>

            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    {item.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.penjualName}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-2 font-semibold text-gray-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Total for this item */}
                      <p className="font-bold text-gray-900">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </p>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan khusus untuk pesanan Anda..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
            </div>

            {/* Summary */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Pajak (0%)</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ongkir</span>
                <span>Gratis</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors mb-2"
            >
              Checkout Sekarang
            </button>

            <button
              onClick={() => router.push("/pembeli/dashboard/menu")}
              className="w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Lanjut Belanja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}