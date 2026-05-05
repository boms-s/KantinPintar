"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { MenuItem, penjual } from "@/lib/types";
import { menuStorage, penjualStorage, cartStorage } from "@/lib/storage";

interface penjualGroup {
  penjual: penjual;
  menus: MenuItem[];
}

export default function MenuPage() {
  const [penjualGroups, setpenjualGroups] = useState<penjualGroup[]>([]);
  const [expandedpenjuals, setExpandedpenjuals] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadData() {
      // Get all menus grouped by penjual
      const menus = menuStorage.getAll();
      const penjuals = penjualStorage.getAll();

      // Group menus by penjual
      const groupedData: penjualGroup[] = penjuals
        .map((penjual) => ({
          penjual,
          menus: menus.filter((m) => m.penjualId === penjual.id),
        }))
        .filter((group) => group.menus.length > 0);

      setpenjualGroups(groupedData);

      // Expand first penjual by default
      if (groupedData.length > 0) {
        setExpandedpenjuals(new Set([groupedData[0].penjual.id]));
      }

      setIsLoading(false);
    }

    loadData();

    // listen for same-tab custom events
    const onMenusUpdated = () => loadData();
    window.addEventListener("sk_menus_updated", onMenusUpdated as EventListener);

    // also listen for storage changes (other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sk_menus_last_update") {
        loadData();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("sk_menus_updated", onMenusUpdated as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const togglepenjual = (penjualId: string) => {
    const newExpanded = new Set(expandedpenjuals);
    if (newExpanded.has(penjualId)) {
      newExpanded.delete(penjualId);
    } else {
      newExpanded.add(penjualId);
    }
    setExpandedpenjuals(newExpanded);
  };

  const handleAddToCart = (menu: MenuItem) => {
    cartStorage.add(menu, 1);
    alert(`${menu.name} ditambahkan ke keranjang!`);
  };

  const filteredGroups = penjualGroups
    .map((group) => ({
      ...group,
      menus: group.menus.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.menus.length > 0);

  if (isLoading) {
    return <div className="p-6 text-center">Loading menu...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Makanan</h1>
        <p className="text-gray-500">Jelajahi berbagai pilihan makanan dari penjual terbaik</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari menu atau penjual..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* penjual Groups */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">Menu tidak ditemukan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div
              key={group.penjual.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* penjual Header - Clickable to expand/collapse */}
              <button
                onClick={() => togglepenjual(group.penjual.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 text-left flex-1">
                  {group.penjual.image && (
                    <img
                      src={group.penjual.image}
                      alt={group.penjual.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{group.penjual.name}</h2>
                    {group.penjual.rating && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{group.penjual.rating}</span>
                      </div>
                    )}
                    {group.penjual.location && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        {group.penjual.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {group.menus.length} menu
                  </span>
                  {expandedpenjuals.has(group.penjual.id) ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* Menu Items */}
              {expandedpenjuals.has(group.penjual.id) && (
                <div className="border-t border-gray-100 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.menus.map((menu) => (
                      <div key={menu.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {menu.image && (
                          <img
                            src={menu.image}
                            alt={menu.name}
                            className="w-full h-40 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm mb-1">{menu.name}</h3>
                          {menu.description && (
                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{menu.description}</p>
                          )}
                          {menu.category && (
                            <p className="text-gray-500 text-xs mb-2">{menu.category}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-gray-900">
                              Rp {menu.price.toLocaleString("id-ID")}
                            </span>
                            <button
                              onClick={() => handleAddToCart(menu)}
                              disabled={!menu.available}
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                menu.available
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart size={14} />
                              {menu.available ? "Pesan" : "Habis"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}