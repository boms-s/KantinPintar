"use client";

import { Check, QrCode, Smartphone, Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export default function AppPromoSection() {
  return (
    <section className="relative z-10 w-full px-6 py-24 overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-7xl"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-16 shadow-[0_30px_100px_-24px_rgba(15,23,42,0.8)] lg:px-20 dark:bg-slate-900 border border-slate-800/50">
          {/* Background Glows */}
          <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative z-10 grid gap-16 lg:grid-cols-2 lg:items-center">
            
            <motion.div variants={containerVariants} className="space-y-10">
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
                  <Zap className="h-4 w-4" /> Seamless Experience
                </div>
                <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:leading-[1.1]">
                  Pesan Cepat. <br />
                  <span className="text-slate-400">Ambil Tanpa Antre.</span>
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                  Tinggalkan cara lama yang bikin capek. Lewat Kantin Pintar, pesananmu disiapkan lebih awal dan langsung bisa diambil. Waktu istirahatmu jadi lebih maksimal!
                </p>
              </motion.div>

              <motion.div variants={containerVariants} className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Mudah Dipakai", desc: "Tampilan modern & intuitif", icon: Smartphone },
                  { title: "Bayar Instan", desc: "Scan QR atau e-wallet", icon: QrCode },
                  { title: "Real-time", desc: "Lacak status pesanan", icon: Zap },
                  { title: "Siap Ambil", desc: "Notifikasi saat selesai", icon: Check },
                ].map((item, idx) => (
                  <motion.div variants={itemVariants} key={idx} className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-md transition-colors hover:bg-white/10">
                    <item.icon className="h-8 w-8 text-blue-400" />
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Link
                  href="/pembeli/login"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-blue-50 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Mulai Pesan Sekarang
                </Link>
              </motion.div>
            </motion.div>

            {/* Interactive Dashboard Mockup */}
            <motion.div 
              variants={itemVariants}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-800/80 p-6 shadow-2xl backdrop-blur-xl"
              >
                {/* Mockup Header */}
                <div className="mb-6 flex items-center gap-4 border-b border-slate-700/50 pb-6">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-400">SK</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Status Pesanan</h3>
                    <p className="text-sm text-slate-400">Order #KP-8821</p>
                  </div>
                  <div className="ml-auto rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    Selesai
                  </div>
                </div>

                {/* Mockup Items */}
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 rounded-xl bg-slate-700/30 p-4 transition-colors hover:bg-slate-700/50"
                    >
                      <div className="h-12 w-12 rounded-lg bg-slate-600/50" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded-md bg-slate-500/50" />
                        <div className="h-3 w-20 rounded-md bg-slate-600/50" />
                      </div>
                      <div className="h-6 w-16 rounded-md bg-slate-500/30" />
                    </motion.div>
                  ))}
                </div>

                {/* Mockup Action */}
                <div className="mt-8">
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white cursor-pointer hover:bg-blue-500 transition-colors">
                    <QrCode className="h-5 w-5" />
                    Tampilkan QR Pengambilan
                  </div>
                </div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, 15, 0], opacity: [0, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -right-8 top-10 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Pesanan Siap!</p>
                    <p className="text-xs text-emerald-200">Silakan ambil di konter 2</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
}
