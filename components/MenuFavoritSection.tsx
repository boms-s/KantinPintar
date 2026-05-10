import { Heart, ShoppingCart } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

export default function MenuFavoritSection() {
  const menus = [
    {
      name: "Nasi Ayam Geprek",
      price: "Rp 15.000",
      gradient: "linear-gradient(135deg, rgba(251, 146, 60, 0.95), rgba(251, 113, 133, 0.8))",
      emoji: "🍗",
    },
    {
      name: "Mie Goreng Spesial",
      price: "Rp 12.000",
      gradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(253, 230, 138, 0.82))",
      emoji: "🍜",
    },
    {
      name: "Ayam Teriyaki",
      price: "Rp 16.000",
      gradient: "linear-gradient(135deg, rgba(253, 186, 116, 0.95), rgba(251, 191, 36, 0.8))",
      emoji: "🍱",
    },
    {
      name: "Es Jeruk",
      price: "Rp 5.000",
      gradient: "linear-gradient(135deg, rgba(252, 211, 77, 0.9), rgba(186, 230, 253, 0.78))",
      emoji: "🍊",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl space-y-12">
        <SectionHeading
          eyebrow="Pilihan populer"
          title="Menu favorit minggu ini"
          description="Menu paling dicari yang bisa dijadikan titik awal saat pengguna membuka aplikasi."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {menus.map((menu, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_18px_48px_-28px_rgba(15,23,42,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(15,23,42,0.62)] dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div
                className="flex h-44 items-center justify-center text-5xl transition duration-300 group-hover:scale-105"
                style={{ backgroundImage: menu.gradient }}
              >
                <span className="drop-shadow-sm">{menu.emoji}</span>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                    {menu.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Menu pilihan dengan tampilan yang lebih mudah dibaca.
                  </p>
                </div>

                <p className="text-base font-semibold text-blue-600 dark:text-blue-400">{menu.price}</p>

                <div className="flex gap-3">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                    <ShoppingCart size={18} />
                    <span>Pesan</span>
                  </button>
                  <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-slate-700 transition duration-300 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10 dark:hover:text-rose-200">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
