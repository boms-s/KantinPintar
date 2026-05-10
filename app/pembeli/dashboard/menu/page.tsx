"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { addToCartAction, getCartAction, getWarungsAction } from "@/app/api/actions";
import { usePembeli } from "@/lib/context/PembeliContext";
import {
  DAY_KEYS,
  DAY_LABELS,
  getTodayScheduleText,
  isWarungCurrentlyOpen,
  parseOperatingHours,
} from "@/lib/utils/operatingHours";

// ─── Types ───────────────────────────────────────────────────────────────────

type WarungMenu = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  isAvailable: boolean;
  category?: { name?: string | null } | null;
  penjual: {
    id: string;
    businessName: string;
    address: string;
    city: string;
    photoUrl?: string | null;
    isOpen: boolean;
    operatingHours?: string | null;
    averageRating?: number | null;
    user?: { email?: string | null } | null;
  };
};

type WarungGroup = {
  penjual: WarungMenu["penjual"];
  menus: WarungMenu[];
};

// ─── Toast Notification ───────────────────────────────────────────────────────

type Toast = { id: number; message: string; type: "success" | "error" };

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
            t.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Floating Cart Button ─────────────────────────────────────────────────────

function FloatingCartButton({
  totalQty,
  totalPrice,
  onClick,
}: {
  totalQty: number;
  totalPrice: number;
  onClick: () => void;
}) {
  if (totalQty === 0) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 text-white shadow-[0_8px_32px_-8px_rgba(37,99,235,0.7)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-[0_12px_40px_-8px_rgba(37,99,235,0.8)] active:scale-95"
    >
      <div className="relative">
        <ShoppingCart size={22} />
        <span className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600">
          {totalQty > 99 ? "99+" : totalQty}
        </span>
      </div>
      <div className="text-left">
        <p className="text-xs font-medium text-blue-100">Lihat Keranjang</p>
        <p className="text-sm font-bold">Rp {totalPrice.toLocaleString("id-ID")}</p>
      </div>
      <ChevronUp size={16} className="ml-1 text-blue-200" />
    </button>
  );
}

// ─── Schedule Tooltip ─────────────────────────────────────────────────────────

function ScheduleTooltip({ operatingHours }: { operatingHours: string | null | undefined }) {
  const [open, setOpen] = useState(false);
  const schedule = parseOperatingHours(operatingHours);
  if (!schedule && !operatingHours) return null;

  return (
    <div className="relative inline-flex">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
        title="Lihat jadwal lengkap"
      >
        <Clock3 size={12} />
        Jadwal
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute left-0 top-full z-20 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Jam Operasional
            </p>
            {schedule ? (
              <div className="space-y-1">
                {DAY_KEYS.map((day) => {
                  const range = schedule[day];
                  return (
                    <div key={day} className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-600">{DAY_LABELS[day]}</span>
                      <span className={`text-xs font-medium ${range ? "text-slate-800" : "text-slate-400"}`}>
                        {range || "Libur"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-600">{operatingHours}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const router = useRouter();
  const { pembeliId } = usePembeli(); // ← ambil dari layout context, tidak perlu session check ulang

  const [warungGroups, setWarungGroups] = useState<WarungGroup[]>([]);
  const [expandedWarungs, setExpandedWarungs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Cart state (synced from DB)
  const [cartQty, setCartQty] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  // Per-menu loading state for "Pesan" button
  const [addingMenuId, setAddingMenuId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }, []);

  // Realtime clock untuk re-kalkulasi status buka/tutup
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(iv);
  }, []);

  // Load cart count from DB
  const refreshCart = useCallback(async (pid: string) => {
    const result = await getCartAction(pid);
    if (result.success && result.data) {
      setCartQty((result.data as any).totalQuantity ?? 0);
      setCartTotal((result.data as any).subtotal ?? 0);
    }
  }, []);

  // Load warung data — runs when pembeliId is available from context
  useEffect(() => {
    if (pembeliId === null) return; // Tunggu context siap
    if (pembeliId === undefined) return;

    let cancelled = false;

    const loadData = async () => {
      const [warungsResult] = await Promise.all([
        getWarungsAction(),
        refreshCart(pembeliId),
      ]);

      if (cancelled) return;

      const menus = (warungsResult.success ? (warungsResult.data as WarungMenu[]) : []) || [];
      const groupedData = Object.values(
        menus.reduce<Record<string, WarungGroup>>((acc, menu) => {
          const sid = menu.penjual.id;
          if (!acc[sid]) acc[sid] = { penjual: menu.penjual, menus: [] };
          acc[sid].menus.push(menu);
          return acc;
        }, {}),
      );
      setWarungGroups(groupedData);

      const firstOpen = groupedData.find((g) => isWarungCurrentlyOpen(g.penjual));
      const firstGroup = firstOpen || groupedData[0];
      if (firstGroup) setExpandedWarungs(new Set([firstGroup.penjual.id]));

      setIsLoading(false);
    };

    loadData();
    return () => { cancelled = true; };
  }, [pembeliId, refreshCart]);

  // Listen for external cart updates
  useEffect(() => {
    const handler = () => { if (pembeliId) refreshCart(pembeliId); };
    window.addEventListener("sk_cart_updated", handler);
    return () => window.removeEventListener("sk_cart_updated", handler);
  }, [pembeliId, refreshCart]);

  const toggleWarung = (warungId: string, currentlyOpen: boolean) => {
    if (!currentlyOpen) return;
    setExpandedWarungs((prev) => {
      const next = new Set(prev);
      if (next.has(warungId)) next.delete(warungId);
      else next.add(warungId);
      return next;
    });
  };

  const handleAddToCart = async (menu: WarungMenu, currentlyOpen: boolean) => {
    if (!pembeliId) { router.push("/pembeli/login"); return; }
    if (!currentlyOpen || !menu.isAvailable || addingMenuId === menu.id) return;

    setAddingMenuId(menu.id);
    try {
      const result = await addToCartAction(pembeliId, menu.id, 1);
      if (!result.success) {
        showToast(result.message || "Gagal menambahkan ke keranjang", "error");
        return;
      }
      // Update cart counts optimistically
      setCartQty((q) => q + 1);
      setCartTotal((t) => t + menu.price);
      showToast(`${menu.name} ditambahkan ke keranjang!`);
      window.dispatchEvent(new Event("sk_cart_updated"));
    } finally {
      setAddingMenuId(null);
    }
  };

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return warungGroups
      .map((group) => {
        const currentlyOpen = isWarungCurrentlyOpen(group.penjual);
        const sellerMatches =
          group.penjual.businessName.toLowerCase().includes(query) ||
          group.penjual.city.toLowerCase().includes(query) ||
          group.penjual.address.toLowerCase().includes(query) ||
          (group.penjual.user?.email || "").toLowerCase().includes(query);
        const menus = currentlyOpen
          ? group.menus.filter(
              (m) =>
                m.name.toLowerCase().includes(query) ||
                m.description?.toLowerCase().includes(query) ||
                (m.category?.name || "").toLowerCase().includes(query),
            )
          : [];
        return { ...group, menus, currentlyOpen, matchesSearch: sellerMatches || menus.length > 0 };
      })
      .filter((g) => g.matchesSearch)
      .sort((a, b) => {
        if (a.currentlyOpen && !b.currentlyOpen) return -1;
        if (!a.currentlyOpen && b.currentlyOpen) return 1;
        return 0;
      });
  }, [searchQuery, warungGroups, now]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-3 text-center">
          <Store className="mx-auto h-10 w-10 animate-pulse text-slate-300" />
          <p className="text-sm text-slate-500">Memuat data warung...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      {/* Floating cart button */}
      <FloatingCartButton
        totalQty={cartQty}
        totalPrice={cartTotal}
        onClick={() => router.push("/pembeli/dashboard/keranjang")}
      />

      <div className="mx-auto max-w-6xl space-y-8 p-6 pb-32">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Warung</h1>
          <p className="text-gray-500">
            Status buka/tutup dihitung otomatis berdasarkan jam operasional (WIB).
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari warung, kota, atau menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filteredGroups.length === 0 ? (
          <div className="rounded-xl bg-white py-12 text-center shadow-sm">
            <Store className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 text-lg text-gray-500">Warung tidak ditemukan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredGroups.map((group) => {
              const { currentlyOpen } = group;
              const isExpanded = expandedWarungs.has(group.penjual.id);
              const todayText = getTodayScheduleText(group.penjual.operatingHours);

              return (
                <div
                  key={group.penjual.id}
                  className={`overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 ${
                    currentlyOpen
                      ? "border-gray-100 bg-white"
                      : "border-gray-200 bg-gray-50/80 opacity-70 grayscale-[40%]"
                  }`}
                >
                  {/* Header — div+role untuk menghindari nested button */}
                  <div
                    role="button"
                    tabIndex={currentlyOpen ? 0 : -1}
                    aria-disabled={!currentlyOpen}
                    onClick={() => toggleWarung(group.penjual.id, currentlyOpen)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleWarung(group.penjual.id, currentlyOpen);
                      }
                    }}
                    className={`flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors ${
                      currentlyOpen ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed"
                    }`}
                  >
                    <div className="flex flex-1 items-start gap-4">
                      {/* Store icon */}
                      <div
                        className={`relative flex h-14 w-14 shrink-0 overflow-hidden items-center justify-center rounded-2xl ${
                          currentlyOpen ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {group.penjual.photoUrl ? (
                          <Image src={group.penjual.photoUrl} alt={group.penjual.businessName} fill className="object-cover" sizes="56px" />
                        ) : (
                          <Store size={22} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Name + Status badge */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={`text-lg font-bold ${currentlyOpen ? "text-gray-900" : "text-gray-500"}`}>
                            {group.penjual.businessName}
                          </h2>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              currentlyOpen
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                currentlyOpen ? "animate-pulse bg-emerald-500" : "bg-rose-400"
                              }`}
                            />
                            {currentlyOpen ? "Buka" : "Tutup"}
                          </span>
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} /> {group.penjual.city}
                          </span>
                          {group.penjual.averageRating ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Star size={14} className="fill-yellow-400 text-yellow-400" />
                              {group.penjual.averageRating}
                            </span>
                          ) : null}
                        </div>

                        <p className="text-sm text-gray-500">{group.penjual.address}</p>

                        {/* Jadwal + tooltip — stopPropagation agar tidak toggle expand */}
                        <div
                          className="flex flex-wrap items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {todayText ? (
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                currentlyOpen ? "text-emerald-700" : "text-gray-400"
                              }`}
                            >
                              <Clock3 size={12} /> {todayText}
                            </span>
                          ) : group.penjual.operatingHours ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                              <Clock3 size={12} /> {group.penjual.operatingHours}
                            </span>
                          ) : null}
                          {group.penjual.operatingHours && (
                            <ScheduleTooltip operatingHours={group.penjual.operatingHours} />
                          )}
                        </div>

                        {!currentlyOpen && (
                          <p className="inline-flex items-center gap-1.5 text-xs text-rose-500">
                            <AlertCircle size={12} />
                            {group.penjual.isOpen === false
                              ? "Warung sedang tutup (manual)"
                              : "Di luar jam operasional"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right chevron */}
                    <div className="flex shrink-0 items-center gap-3">
                      {currentlyOpen ? (
                        <>
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {group.menus.length} menu
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </>
                      ) : (
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                          Dikunci
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu grid */}
                  {currentlyOpen && isExpanded && (
                    <div className="border-t border-gray-100 p-6">
                      {group.menus.length === 0 ? (
                        <p className="py-4 text-center text-sm text-gray-400">
                          Tidak ada menu yang cocok.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {group.menus.map((menu) => {
                            const isAdding = addingMenuId === menu.id;
                            return (
                              <div
                                key={menu.id}
                                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                              >
                                {menu.image && (
                                  <div className="relative h-40 w-full">
                                    <Image
                                      src={menu.image}
                                      alt={menu.name}
                                      fill
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="space-y-3 p-4">
                                  <div>
                                    <h3 className="text-sm font-bold text-gray-900">{menu.name}</h3>
                                    {menu.description && (
                                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                                        {menu.description}
                                      </p>
                                    )}
                                    {menu.category?.name && (
                                      <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                                        {menu.category.name}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <span className="text-base font-bold text-gray-900">
                                      Rp {menu.price.toLocaleString("id-ID")}
                                    </span>
                                    <button
                                      onClick={() => handleAddToCart(menu, currentlyOpen)}
                                      disabled={!menu.isAvailable || isAdding}
                                      className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                                        !menu.isAvailable
                                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                          : isAdding
                                          ? "cursor-wait bg-blue-400 text-white"
                                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                                      }`}
                                    >
                                      <ShoppingCart size={14} />
                                      {!menu.isAvailable ? "Habis" : isAdding ? "Menambahkan..." : "Pesan"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tutup state */}
                  {!currentlyOpen && (
                    <div className="border-t border-dashed border-gray-200 px-6 py-4">
                      <p className="text-sm text-gray-400">
                        Menu dan pemesanan tidak tersedia saat warung tutup.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}