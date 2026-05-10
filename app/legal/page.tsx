"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale,
  Eye,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";

export default function LegalPage() {
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
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white"
          >
            Pusat Legalitas & Privasi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-slate-600 dark:text-slate-400"
          >
            Pembaruan Terakhir: 11 Mei 2026
          </motion.p>
        </div>

        {/* Legal Sections */}
        <div className="space-y-12">
          {/* Section: Syarat & Ketentuan */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                <Scale className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Syarat & Ketentuan</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <p>Dengan menggunakan platform Smart Kantin, Anda menyetujui semua persyaratan yang tercantum di sini. Kami menyediakan layanan untuk memudahkan transaksi kantin digital bagi pembeli dan penjual.</p>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-8">1. Penggunaan Akun</h3>
              <p>Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi akun Anda. Segala aktivitas yang dilakukan melalui akun Anda menjadi tanggung jawab penuh pemegang akun.</p>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-8">2. Transaksi & Pembayaran</h3>
              <p>Semua pembayaran yang dilakukan melalui platform Smart Kantin bersifat final kecuali ditentukan lain oleh kebijakan pengembalian dana dari masing-masing penjual.</p>
            </div>
          </motion.section>

          {/* Section: Kebijakan Privasi */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-white border border-slate-200 dark:bg-slate-900/60 dark:border-white/5 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Kebijakan Privasi</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <p>Kami sangat menghargai privasi data Anda. Informasi pribadi yang kami kumpulkan digunakan semata-mata untuk meningkatkan layanan kami.</p>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mt-8">Data Yang Kami Kumpulkan</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Informasi Profil (Nama, Email, Nomor Telepon)</li>
                <li>Data Transaksi dan Riwayat Pesanan</li>
                <li>Data Perangkat dan Lokasi (jika diizinkan)</li>
              </ul>
              <p className="mt-6">Kami tidak akan pernah menjual data pribadi Anda kepada pihak ketiga untuk kepentingan pemasaran tanpa persetujuan eksplisit dari Anda.</p>
            </div>
          </motion.section>

          {/* Section: Keamanan */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[2.5rem] bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent)]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">Keamanan Data</h2>
              </div>
              <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
                <p>Setiap bit data yang dikirimkan melalui jaringan kami dilindungi oleh enkripsi SSL/TLS tingkat militer. Kami secara berkala melakukan audit keamanan untuk memastikan standar perlindungan tertinggi bagi dana dan informasi Anda.</p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Lock className="h-5 w-5 text-blue-400 mb-2" />
                    <p className="text-white font-bold text-xs uppercase tracking-widest">Enkripsi End-to-End</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
                    <p className="text-white font-bold text-xs uppercase tracking-widest">Two-Factor Auth</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
