import Link from "next/link";
import { ArrowRight, Clock3, Rocket, ShieldCheck, FileChartColumnIncreasing } from "lucide-react";

import { FeatureCard } from "@/components/ui/feature-card";

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur dark:border-blue-500/20 dark:bg-slate-950/70 dark:text-slate-200">
            <Rocket className="h-4 w-4 text-blue-600" />
            Solusi pesanan kantin yang cepat dan rapi
          </div>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl lg:text-7xl dark:text-white">
              Kantin <span className="text-blue-600 dark:text-blue-400">Pintar</span> Revolusi Digital untuk Ekosistem Kantin Modern.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600 md:text-xl dark:text-slate-300">
              Transformasi transaksi kantin konvensional menjadi otomatis dan transparan. Solusi cerdas bagi penjual modern dan pembeli yang dinamis.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={ShieldCheck}
              title="Keamanan Bertransaksi"
              description="Kemudahan transaksi dengan keamanan data yang terjamin untuk semua pengguna."
              tone="emerald"
            />
            <FeatureCard
              icon={FileChartColumnIncreasing}
              title="Inventori & Laporan Real-Time"
              description="Pantau penjualan dan stok dengan laporan real-time yang mudah dipahami."
              tone="blue"
            />
            <FeatureCard
              icon={Clock3}
              title="Kemudahan & Efisiensi"
              description="Pesan tanpa antre dengan proses pemesanan yang cepat dan efisien."
              tone="amber"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/pembeli/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Daftar sekarang sebagai pembeli
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/penjual/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur transition duration-300 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-200"
            >
              Daftar sebagai penjual
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.55)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>09:41</span>
                <span>Smart Kantin</span>
              </div>

              <div className="space-y-5 px-5 py-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Selamat datang kembali</p>
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Siap pesan tanpa antre?</h2>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Promo makan siang</p>
                      <p className="text-slate-500 dark:text-slate-400">Hemat hingga 30% hari ini</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-200">Aktif</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { title: "Nasi Ayam Geprek", price: "Rp 15.000", tone: "bg-orange-200" },
                    { title: "Mie Goreng Spesial", price: "Rp 12.000", tone: "bg-amber-200" },
                    { title: "Es Jeruk Segar", price: "Rp 5.000", tone: "bg-sky-200" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
                      <div className={`h-12 w-12 rounded-2xl ${item.tone}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.price}</p>
                      </div>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700">
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
