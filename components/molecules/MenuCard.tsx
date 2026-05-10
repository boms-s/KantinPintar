import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import type { MenuItem } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (quantity: number) => void;
  loading?: boolean;
}

export function MenuCard({ item, onAddToCart, loading = false }: MenuCardProps) {
  return (
    <Card className="flex flex-col gap-4 h-full">
      {item.image && (
        <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold text-slate-950 dark:text-white">
              {item.name}
            </h4>
            {item.description && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            )}
          </div>
          {item.category && (
            <Badge variant="primary">{item.category}</Badge>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-950 dark:text-white">
            Rp {item.price.toLocaleString("id-ID")}
          </span>
          {item.available !== false && (
            <Badge variant="success">Tersedia</Badge>
          )}
        </div>
      </div>

      <Button
        onClick={() => onAddToCart(1)}
        disabled={!item.available}
        loading={loading}
        size="sm"
        fullWidth
      >
        <ShoppingCart className="h-4 w-4" />
        Tambah
      </Button>
    </Card>
  );
}
