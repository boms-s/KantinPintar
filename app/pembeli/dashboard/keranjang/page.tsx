"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, Store, PackageOpen } from "lucide-react";
import Image from "next/image";

import {
  clearCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartQuantityAction,
  createOrderAndGetPaymentTokenAction,
  syncPaymentStatusAction,
} from "@/app/api/actions";
import { usePembeli } from "@/lib/context/PembeliContext";
import Script from "next/script";

// ─── Types ────────────────────────────────────────────────────────────────────

type CartMenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  penjual?: { id: string; businessName: string } | null;
};

type CartItemData = {
  id: string;
  menuId: string;
  quantity: number;
  price: number; // snapshot harga saat ditambah
  menu: CartMenuItem;
};

type CartData = {
  items: CartItemData[];
  subtotal: number;
  itemCount: number;
  totalQuantity: number;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KeranjangPage() {
  const router = useRouter();
  const { pembeliId } = usePembeli(); // ← dari layout context

  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);

  // Load cart dari DB
  const loadCart = useCallback(async (pid: string) => {
    const result = await getCartAction(pid);
    if (result.success && result.data) {
      setCart(result.data as CartData);
    } else {
      setCart({ items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 });
    }
  }, []);

  // Load saat pembeliId tersedia dari context
  useEffect(() => {
    if (!pembeliId) return;
    let cancelled = false;
    const init = async () => {
      await loadCart(pembeliId);
      if (!cancelled) setIsLoading(false);
    };
    init();
    return () => { cancelled = true; };
  }, [pembeliId, loadCart]);

  // Listen for cart update events
  useEffect(() => {
    const handler = () => { if (pembeliId) loadCart(pembeliId); };
    window.addEventListener("sk_cart_updated", handler);
    return () => window.removeEventListener("sk_cart_updated", handler);
  }, [pembeliId, loadCart]);

  const handleUpdateQty = async (item: CartItemData, newQty: number) => {
    if (!pembeliId || updatingId === item.menuId) return;
    setUpdatingId(item.menuId);

    // Optimistic update
    setCart((prev) => {
      if (!prev) return prev;
      if (newQty <= 0) {
        const filtered = prev.items.filter((i) => i.menuId !== item.menuId);
        const subtotal = filtered.reduce((s, i) => s + i.price * i.quantity, 0);
        return { ...prev, items: filtered, subtotal, totalQuantity: filtered.reduce((s, i) => s + i.quantity, 0), itemCount: filtered.length };
      }
      const updated = prev.items.map((i) =>
        i.menuId === item.menuId ? { ...i, quantity: newQty } : i,
      );
      const subtotal = updated.reduce((s, i) => s + i.price * i.quantity, 0);
      return { ...prev, items: updated, subtotal, totalQuantity: updated.reduce((s, i) => s + i.quantity, 0) };
    });

    await updateCartQuantityAction(pembeliId, item.menuId, newQty);
    await loadCart(pembeliId); // Sync with DB
    setUpdatingId(null);
    window.dispatchEvent(new Event("sk_cart_updated"));
  };

  const handleRemove = async (item: CartItemData) => {
    if (!pembeliId || updatingId === item.menuId) return;
    setUpdatingId(item.menuId);

    // Optimistic remove
    setCart((prev) => {
      if (!prev) return prev;
      const filtered = prev.items.filter((i) => i.menuId !== item.menuId);
      const subtotal = filtered.reduce((s, i) => s + i.price * i.quantity, 0);
      return { ...prev, items: filtered, subtotal, totalQuantity: filtered.reduce((s, i) => s + i.quantity, 0), itemCount: filtered.length };
    });

    await removeFromCartAction(pembeliId, item.menuId);
    await loadCart(pembeliId);
    setUpdatingId(null);
    window.dispatchEvent(new Event("sk_cart_updated"));
  };

  const handleClearAll = async () => {
    if (!pembeliId || isClearingAll || isCheckoutLoading) return;
    const confirmed = window.confirm("Hapus semua item dari keranjang?");
    if (!confirmed) return;
    setIsClearingAll(true);
    setCart({ items: [], subtotal: 0, itemCount: 0, totalQuantity: 0 }); // optimistic
    await clearCartAction(pembeliId);
    await loadCart(pembeliId);
    setIsClearingAll(false);
    window.dispatchEvent(new Event("sk_cart_updated"));
  };

  const handleCheckout = async () => {
    if (!pembeliId || isCheckoutLoading) return;
    setIsCheckoutLoading(true);

    try {
      const res = await createOrderAndGetPaymentTokenAction(pembeliId, "");
      if (!res.success || !res.token) {
        alert(res.message || "Gagal membuat transaksi");
        setIsCheckoutLoading(false);
        return;
      }

      // Refresh cart context
      window.dispatchEvent(new Event("sk_cart_updated"));

      // Trigger Snap popup
      (window as any).snap.pay(res.token, {
        onSuccess: async function (result: any) {
          if (res.orderId) await syncPaymentStatusAction(res.orderId);
          router.push("/pembeli/dashboard/pesanan");
        },
        onPending: async function (result: any) {
          if (res.orderId) await syncPaymentStatusAction(res.orderId);
          router.push("/pembeli/dashboard/pesanan");
        },
        onError: function (result: any) {
          alert("Pembayaran gagal!");
          router.push("/pembeli/dashboard/pesanan");
        },
        onClose: function () {
          alert("Anda menutup popup sebelum menyelesaikan pembayaran.");
          router.push("/pembeli/dashboard/pesanan");
        },
      });
    } catch (error) {
      alert("Terjadi kesalahan sistem");
      setIsCheckoutLoading(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 animate-pulse text-slate-300" />
          <p className="text-sm text-slate-500">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  // ─── Empty Cart ────────────────────────────────────────────────────────────
  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Keranjang</h1>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
          <PackageOpen className="mx-auto h-14 w-14 text-gray-300" />
          <p className="mt-4 text-lg font-semibold text-gray-600">Keranjang Anda kosong</p>
          <p className="mt-2 text-sm text-gray-400">Tambahkan menu dari warung pilihan Anda.</p>
          <button
            onClick={() => router.push("/pembeli/dashboard/menu")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <ShoppingCart size={16} /> Jelajahi Menu
          </button>
        </div>
      </div>
    );
  }

  // Group items by penjual
  const grouped = cart.items.reduce<Record<string, { businessName: string; items: CartItemData[] }>>(
    (acc, item) => {
      const pid = item.menu.penjual?.id ?? "unknown";
      const bname = item.menu.penjual?.businessName ?? "Warung";
      if (!acc[pid]) acc[pid] = { businessName: bname, items: [] };
      acc[pid].items.push(item);
      return acc;
    },
    {},
  );

  const tax = 0;
  const total = cart.subtotal + tax;

  // ─── Cart with items ───────────────────────────────────────────────────────
  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "Mid-client-UKHo83tnCiFKyoDg"}
        strategy="lazyOnload"
      />
      <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Keranjang</h1>
          <span className="text-sm text-gray-500">{cart.totalQuantity} item</span>
        </div>
        <button
          onClick={handleClearAll}
          disabled={isClearingAll}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={13} />
          {isClearingAll ? "Menghapus..." : "Hapus Semua"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left — Cart Items */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([penjualId, group]) => (
            <div key={penjualId} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* Warung header */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Store size={16} />
                </div>
                <span className="font-semibold text-gray-900">{group.businessName}</span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {group.items.map((item) => {
                  const isUpdating = updatingId === item.menuId;
                  return (
                    <div
                      key={item.menuId}
                      className={`flex gap-4 p-5 transition-opacity ${isUpdating ? "opacity-50" : ""}`}
                    >
                      {/* Image */}
                      {item.menu.image ? (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={item.menu.image}
                            alt={item.menu.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                          <ShoppingCart size={24} />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex flex-1 flex-col justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.menu.name}</h3>
                          <p className="text-sm text-gray-500">
                            Rp {item.price.toLocaleString("id-ID")} / item
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                            <button
                              onClick={() => handleUpdateQty(item, item.quantity - 1)}
                              disabled={isUpdating}
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(item, item.quantity + 1)}
                              disabled={isUpdating}
                              className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={15} />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="font-bold text-gray-900">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </p>
                            <button
                              onClick={() => handleRemove(item)}
                              disabled={isUpdating}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-500 disabled:cursor-not-allowed"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-bold text-gray-900">Ringkasan Pesanan</h2>
            </div>

            <div className="space-y-4 px-6 py-5">
              {/* Summary rows */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.totalQuantity} item)</span>
                  <span>Rp {cart.subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pajak</span>
                  <span>Rp {tax.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Ongkir</span>
                  <span className="font-medium text-emerald-600">Gratis</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Checkout */}
              <button
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isCheckoutLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memproses...
                  </>
                ) : (
                  "Lanjut ke Checkout"
                )}
              </button>

              <button
                onClick={() => router.push("/pembeli/dashboard/menu")}
                disabled={isCheckoutLoading}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Tambah Menu Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}