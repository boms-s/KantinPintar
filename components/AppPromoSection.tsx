import { CheckCircle } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";

export default function AppPromoSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-blue-200/60 bg-slate-950 px-6 py-12 text-white shadow-[0_30px_80px_-36px_rgba(15,23,42,0.8)] lg:px-10 dark:border-blue-500/20 dark:bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <SectionHeading
              eyebrow="Akses cepat"
              title="Pesan sekarang, ambil tanpa antre"
              description="Pengguna bisa fokus memilih menu, sementara alur pesanan dan pengambilan dibuat lebih ringkas dan jelas."
              className="max-w-2xl"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Pesan melalui antarmuka yang cepat dibaca",
                "Bayar dengan skenario yang siap dikembangkan",
                "Lacak status pesanan secara real-time",
                "Dapatkan poin reward setiap pemesanan",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <span className="text-sm leading-6 text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/pembeli/login"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/pembeli/dashboard/menu"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-white/30 hover:bg-white/10"
              >
                Lihat menu
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-x-10 top-10 h-40 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="relative flex h-80 w-80 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur">
              <div className="absolute inset-6 rounded-[1.5rem] border border-dashed border-white/15" />
              <div className="relative z-10 flex h-44 w-44 items-center justify-center rounded-full bg-white text-6xl shadow-2xl shadow-blue-950/30">
                🛍️
              </div>
              <div className="absolute right-10 top-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300 text-2xl text-slate-950 shadow-lg shadow-emerald-950/20">
                ✓
              </div>
              <div className="absolute bottom-12 left-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-xl shadow-lg shadow-amber-950/20">
                ⭐
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
