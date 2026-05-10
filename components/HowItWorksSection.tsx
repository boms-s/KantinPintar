"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, Utensils } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Pilih Menu",
    desc: "Eksplorasi puluhan menu dari berbagai kantin favoritmu.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: ShoppingBag,
    title: "2. Pesan & Bayar",
    desc: "Gunakan saldo digital atau QRIS untuk checkout kilat.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Utensils,
    title: "3. Ambil Pesanan",
    desc: "Dapatkan notifikasi saat makanan siap. Tanpa antre panjang!",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative z-10 w-full px-6 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold uppercase tracking-widest text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            Cara Kerja
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl dark:text-white"
          >
            Sesimpel itu untuk <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400">mengisi perutmu</span>
          </motion.h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.2, type: "spring", stiffness: 300, damping: 24 }}
              className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${step.bg} ${step.color}`}>
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-950 dark:text-white">{step.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
