"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Clock3, MapPin, ShoppingCart, Store, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { addToCartAction, getCurrentUserAction, getWarungsAction } from "@/app/api/actions";

type BuyerSession = {
  id: string;
  role: string;
  pembeli?: {
    id: string;
  } | null;
};

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
    isOpen: boolean;
    operatingHours?: string | null;
    averageRating?: number | null;
    user?: {
      email?: string | null;
    } | null;
  };
};

type WarungGroup = {
  penjual: WarungMenu["penjual"];
  menus: WarungMenu[];
};

export default function MenuPage() {
  const router = useRouter();
  const [buyerId, setBuyerId] = useState<string | null>(null);
  const [warungGroups, setWarungGroups] = useState<WarungGroup[]>([]);
  const [expandedWarungs, setExpandedWarungs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [sessionResult, warungsResult] = await Promise.all([getCurrentUserAction(), getWarungsAction()]);

      if (!sessionResult.success || !sessionResult.data || sessionResult.data.role !== "PEMBELI") {
        router.replace("/pembeli/login");
        return;
      }

      const session = sessionResult.data as BuyerSession;
      setBuyerId(session.pembeli?.id || null);

      const menus = (warungsResult.success ? (warungsResult.data as WarungMenu[]) : []) || [];
      const groupedData = Object.values(
        menus.reduce<Record<string, WarungGroup>>((accumulator, menu) => {
          const sellerId = menu.penjual.id;

          if (!accumulator[sellerId]) {
            accumulator[sellerId] = {
              penjual: menu.penjual,
              menus: [],
            };
          }

          accumulator[sellerId].menus.push(menu);
          return accumulator;
        }, {}),
      );

      setWarungGroups(groupedData);

      const firstOpenGroup = groupedData.find((group) => group.penjual.isOpen);
      const firstGroup = firstOpenGroup || groupedData[0];

      if (firstGroup) {
        setExpandedWarungs(new Set([firstGroup.penjual.id]));
      }

      setIsLoading(false);
    };

    loadData();
  }, [router]);

  const toggleWarung = (warungId: string, isOpen: boolean) => {
    if (!isOpen) {
      return;
    }

    const next = new Set(expandedWarungs);
    if (next.has(warungId)) {
      next.delete(warungId);
    } else {
      next.add(warungId);
    }
    setExpandedWarungs(next);
  };

  const handleAddToCart = async (menu: WarungMenu, isOpen: boolean) => {
    if (!buyerId) {
      router.push("/pembeli/login");
      return;
    }

    if (!isOpen || !menu.isAvailable) {
      return;
    }

    const result = await addToCartAction(buyerId, menu.id, 1);
    if (!result.success) {
      alert(result.message || "Gagal menambahkan ke keranjang");
      return;
    }

    window.dispatchEvent(new Event("sk_cart_updated"));
    alert(`${menu.name} ditambahkan ke keranjang!`);
  };

  const filteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return warungGroups
      .map((group) => {
        const sellerMatches =
          group.penjual.businessName.toLowerCase().includes(query) ||
          group.penjual.city.toLowerCase().includes(query) ||
          group.penjual.address.toLowerCase().includes(query) ||
          (group.penjual.user?.email || "").toLowerCase().includes(query);

        const menus = group.penjual.isOpen
          ? group.menus.filter(
              (menu) =>
                menu.name.toLowerCase().includes(query) ||
                menu.description?.toLowerCase().includes(query) ||
                (menu.category?.name || "").toLowerCase().includes(query),
            )
          : [];

        return {
          ...group,
          menus,
          matchesSearch: sellerMatches || menus.length > 0,
        };
      })
      .filter((group) => group.matchesSearch);
  }, [searchQuery, warungGroups]);

  if (isLoading) {
    return <div className="p-6 text-center">Loading warung...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Warung</h1>
        <p className="text-gray-500">Lihat status buka/tutup warung penjual sebelum memesan.</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Cari warung, kota, email, atau menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredGroups.length === 0 ? (
        <div className="rounded-lg bg-white py-12 text-center">
          <p className="text-lg text-gray-500">Warung tidak ditemukan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const isOpen = group.penjual.isOpen;
            const isExpanded = expandedWarungs.has(group.penjual.id);

            return (
              <div key={group.penjual.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <button
                  onClick={() => toggleWarung(group.penjual.id, isOpen)}
                  disabled={!isOpen}
                  className={`flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors ${
                    isOpen ? "hover:bg-gray-50" : "cursor-not-allowed bg-gray-50/60 opacity-80"
                  }`}
                >
                  <div className="flex flex-1 items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                      <Store size={22} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">{group.penjual.businessName}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {isOpen ? "Buka" : "Tutup"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{group.penjual.city}</span>
                        {group.penjual.user?.email ? <span>{group.penjual.user.email}</span> : null}
                        {group.penjual.averageRating ? (
                          <span className="inline-flex items-center gap-1.5"><Star size={14} className="fill-yellow-400 text-yellow-400" />{group.penjual.averageRating}</span>
                        ) : null}
                      </div>

                      <p className="text-sm text-gray-500">{group.penjual.address}</p>
                      {group.penjual.operatingHours ? (
                        <p className="inline-flex items-center gap-1.5 text-sm text-gray-500"><Clock3 size={14} />Jam buka: {group.penjual.operatingHours}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{group.penjual.isOpen ? `${group.menus.length} menu` : "Dikunci"}</span>
                    {isOpen ? (
                      isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">Tutup</span>
                    )}
                  </div>
                </button>

                {isOpen ? (
                  isExpanded ? (
                    <div className="border-t border-gray-100 p-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {group.menus.map((menu) => (
                          <div key={menu.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 transition-shadow hover:shadow-md">
                            {menu.image && <img src={menu.image} alt={menu.name} className="h-40 w-full object-cover" />}
                            {menu.image && (
                              <div className="relative h-40 w-full">
                                <Image src={menu.image} alt={menu.name} fill className="object-cover" />
                              </div>
                            )}
                            <div className="space-y-3 p-4">
                              <div>
                                <h3 className="font-bold text-gray-900 text-sm">{menu.name}</h3>
                                {menu.description ? <p className="mt-1 line-clamp-2 text-xs text-gray-600">{menu.description}</p> : null}
                                {menu.category?.name ? <p className="mt-2 text-xs text-gray-500">{menu.category.name}</p> : null}
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">Rp {menu.price.toLocaleString("id-ID")}</span>
                                <button
                                  onClick={() => handleAddToCart(menu, isOpen)}
                                  disabled={!menu.isAvailable}
                                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                                    menu.isAvailable ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-gray-300 text-gray-500"
                                  }`}
                                >
                                  <ShoppingCart size={14} />
                                  {menu.isAvailable ? "Pesan" : "Habis"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-dashed border-gray-200 px-6 py-5 text-sm text-gray-500">
                      Warung ini belum dibuka.
                    </div>
                  )
                ) : (
                  <div className="border-t border-dashed border-gray-200 px-6 py-5 text-sm text-gray-500">
                    Warung sedang tutup, menu dan pemesanan dinonaktifkan.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}