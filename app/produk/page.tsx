"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Store, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Smartphone 
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { cn } from "@/lib/utils";

const buyerFeatures = [
  "Pesan dari mana saja via smartphone",
  "Scan QR untuk bayar instan",
  "Notifikasi real-time status pesanan",
  "Riwayat transaksi lengkap",
];

const sellerFeatures = [
  "Kelola menu & stok real-time",
  "Laporan penjualan harian & bulanan",
  "Manajemen antrean otomatis",
  "Terintegrasi dengan pembayaran digital",
];

export default function ProdukPage() {
  return (
    <main className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AnimatedBackground />
      
      {/* Header Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain p-1" />
          </div>
          <span className="text-xl font-bold text-slate-950 dark:text-white">Smart Kantin</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
          Kembali ke Beranda
        </Link>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
          >
            Ekosistem Kantin Digital
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white"
          >
            Satu Platform, <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Semua Kebutuhan Kantin</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Dari pemesanan hingga laporan keuangan, Smart Kantin menyediakan solusi ujung-ke-ujung untuk modernisasi kantin Anda.
          </motion.p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-12 lg:grid-cols-2 mb-32">
          {/* Untuk Pembeli */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-2xl transition-all dark:border-white/5 dark:bg-slate-900/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 mb-8">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mb-4">Untuk Pembeli</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Nikmati pengalaman jajan yang lebih modern tanpa harus berdesakan di depan stan. Pesan sambil duduk, bayar digital, dan ambil saat sudah matang.
            </p>
            <ul className="space-y-4">
              {buyerFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Untuk Penjual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm hover:shadow-2xl transition-all dark:border-white/5 dark:bg-slate-900/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/20 mb-8">
              <Store className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mb-4">Untuk Penjual</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Tingkatkan efisiensi operasional warung Anda dengan sistem manajemen menu, pesanan, dan keuangan yang terintegrasi secara otomatis.
            </p>
            <ul className="space-y-4">
              {sellerFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Pricing Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-950 dark:text-white mb-4">Harga & Paket</h2>
            <p className="text-slate-600 dark:text-slate-400">Pilih paket yang paling sesuai dengan skala operasional kantin Anda.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { 
                name: "Starter", 
                price: "Gratis", 
                desc: "Untuk kantin sekolah kecil", 
                features: ["50 Pesanan/Bulan", "Manajemen Menu Dasar", "Laporan Harian", "Pembayaran Tunai"],
                accent: "blue"
              },
              { 
                name: "Business", 
                price: "Rp 150rb", 
                period: "/bln", 
                desc: "Solusi lengkap untuk kantin modern", 
                features: ["Pesanan Tak Terbatas", "Integrasi QRIS", "Statistik Penjualan", "Manajemen Stok"],
                accent: "blue",
                popular: true
              },
              { 
                name: "Enterprise", 
                price: "Custom", 
                desc: "Untuk jaringan kantin universitas", 
                features: ["Multi-Stan Dashboard", "API Integration", "Dedicated Support", "Sistem Saldo Institusi"],
                accent: "blue"
              }
            ].map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "relative p-8 rounded-[2rem] border transition-all",
                  pkg.popular ? "border-blue-500 shadow-xl shadow-blue-500/10 bg-white dark:bg-slate-900" : "border-slate-200 bg-white/50 dark:border-white/5 dark:bg-slate-900/40"
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Paling Populer
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-slate-950 dark:text-white">{pkg.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{pkg.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-extrabold text-slate-950 dark:text-white">{pkg.price}</span>
                  {pkg.period && <span className="text-slate-500 text-sm">{pkg.period}</span>}
                </div>
                <ul className="space-y-4 mb-8">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                      <Zap className="h-4 w-4 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={cn(
                  "w-full py-3 rounded-xl font-bold text-sm transition-all",
                  pkg.popular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                )}>
                  Pilih Paket
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* New Features Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] bg-slate-900 p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent)]" />
          <h2 className="text-3xl font-bold mb-6">Selalu Menjadi Lebih Baik</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Tim kami terus bekerja mengembangkan fitur baru setiap minggunya. <br className="hidden sm:block" />
            Nantikan pembaruan untuk sistem reservasi meja dan analitik berbasis AI.
          </p>
          <div className="flex justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-sm font-semibold backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-blue-400" />
              Fitur Baru Segera Hadir
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
