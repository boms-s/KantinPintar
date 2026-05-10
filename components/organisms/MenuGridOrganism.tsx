"use client";

import { MenuCard } from "@/components/molecules/MenuCard";
import { Skeleton, SkeletonCard } from "@/components";
import type { MenuItem } from "@/lib/types";
import { useCallback, useState } from "react";

interface MenuGridProps {
  items: MenuItem[];
  loading?: boolean;
  onAddToCart: (item: MenuItem, quantity: number) => void;
}

export function MenuGridOrganism({ items, loading = false, onAddToCart }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addingItemId, setAddingItemId] = useState<string | null>(null);

  const categories: string[] = [
    "all",
    ...Array.from(new Set(items.map((item) => item.category).filter((c): c is string => Boolean(c))))
  ];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleAddToCart = useCallback(
    (item: MenuItem) => {
      setAddingItemId(item.id);
      onAddToCart(item, 1);
      setTimeout(() => setAddingItemId(null), 1000);
    },
    [onAddToCart],
  );

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === category
                ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            }`}
          >
            {category === "all" ? "Semua" : category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tidak ada menu tersedia
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onAddToCart={() => handleAddToCart(item)}
              loading={addingItemId === item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
