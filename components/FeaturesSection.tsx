"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  Clock, 
  CreditCard, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Pemesanan Kilat",
    description: "Alur pemesanan yang dirancang untuk kecepatan. Pilih menu, bayar, dan dapatkan notifikasi pengambilan dalam hitungan menit.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Sistem Cashless",
    description: "Lupakan kerumitan uang kembalian. Integrasi penuh dengan berbagai e-wallet dan QRIS untuk transaksi yang lebih aman.",
    icon: CreditCard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Status Real-time",
    description: "Pantau status pesananmu mulai dari diterima, dimasak, hingga siap diambil dengan notifikasi langsung ke perangkatmu.",
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Mobile First",
    description: "Tampilan yang dioptimalkan sepenuhnya untuk perangkat seluler. Akses kantin favoritmu langsung dari kantong.",
    icon: Smartphone,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Analitik Penjualan",
    description: "Khusus untuk penjual: Pantau performa menu dan pendapatan harian melalui dashboard statistik yang informatif.",
    icon: BarChart3,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Transaksi Aman",
    description: "Setiap transaksi dan data pengguna dilindungi dengan enkripsi tingkat lanjut untuk ketenangan pikiran Anda.",
    icon: ShieldCheck,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

export function FeaturesSection() {
  return (
    <section className="relative z-10 w-full px-6 py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
          >
            Keunggulan Kami
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl dark:text-white"
          >
            Solusi Digital untuk <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kantin yang Lebih Maju
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
          >
            Kami menggabungkan teknologi modern dengan kemudahan penggunaan untuk menciptakan pengalaman jajan yang tak terlupakan.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-2xl dark:border-white/5 dark:bg-slate-900/40"
            >
              {/* Background Glow on Hover */}
              <div className={cn(
                "absolute -right-20 -top-20 h-40 w-40 rounded-full blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-20",
                feature.bg
              )} />

              <div className={cn(
                "mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform duration-500 group-hover:rotate-12",
                feature.bg,
                feature.color
              )}>
                <feature.icon className="h-7 w-7" />
              </div>

              <h3 className="mb-3 text-xl font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 opacity-0 transition-all duration-500 group-hover:translate-x-2 group-hover:opacity-100">
                Pelajari Lebih Lanjut
                <Zap className="h-3 w-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
