"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Home, User, Store, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  badge: string;
  title: string;
  description: string;
  accent: "blue" | "purple" | "red";
  children: ReactNode;
  asideTitle?: string;
  asideDescription?: string;
  className?: string;
};

const accentStyles = {
  blue: {
    outer: "from-blue-600/20 via-sky-500/10 to-transparent",
    badge: "bg-blue-600 text-white",
    text: "text-blue-600",
    ring: "ring-blue-100",
    glow: "bg-blue-500/20",
  },
  purple: {
    outer: "from-violet-600/20 via-fuchsia-500/10 to-transparent",
    badge: "bg-violet-600 text-white",
    text: "text-violet-600",
    ring: "ring-violet-100",
    glow: "bg-violet-500/20",
  },
  red: {
    outer: "from-rose-600/20 via-red-500/10 to-transparent",
    badge: "bg-red-600 text-white",
    text: "text-red-600",
    ring: "ring-red-100",
    glow: "bg-red-500/20",
  },
} as const;

export function AuthShell({
  badge,
  title,
  description,
  accent,
  children,
  asideTitle,
  asideDescription,
  className,
}: AuthShellProps) {
  const styles = accentStyles[accent];

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950", className)}>
      {/* Background Animated Elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute -top-24 -left-24 h-96 w-96 rounded-full blur-[100px]", styles.glow)} 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={cn("absolute -bottom-24 -right-24 h-96 w-96 rounded-full blur-[120px]", styles.glow)} 
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid w-full max-w-6xl gap-8 lg:grid-cols-2"
        >
          {/* Left Panel: Info & Features */}
          <div className="hidden flex-col justify-between rounded-[2.5rem] border border-slate-200/50 bg-white/40 p-10 backdrop-blur-2xl lg:flex dark:border-white/10 dark:bg-slate-900/40">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-sm ring-1 ring-inset", styles.badge, styles.ring)}
              >
                {badge}
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]"
                >
                  {title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-300"
                >
                  {description}
                </motion.p>
              </div>
            </div>

            <div className="space-y-4">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400"
              >
                Navigasi Cepat
              </motion.p>
              <div className="grid gap-3">
                {[
                  { title: "Beranda Utama", desc: "Kembali ke halaman depan", icon: Home, href: "/" },
                  { title: "Portal Pembeli", desc: "Masuk sebagai pelanggan", icon: User, href: "/pembeli/login" },
                  { title: "Portal Penjual", desc: "Kelola toko & pesanan", icon: Store, href: "/penjual/login" },
                ].map((nav, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                  >
                    <Link 
                      href={nav.href}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-200/50 bg-white/50 p-4 transition-all hover:bg-white hover:shadow-md dark:border-white/5 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                    >
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", styles.badge)}>
                        <nav.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{nav.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{nav.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: The Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-900">
              <div className="relative border-b border-slate-100 p-8 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg", styles.badge)}>
                    <UtensilsCrossed className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-blue-500"></span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Smart Kantin</p>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{asideTitle ?? title}</h2>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <p className="mb-8 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {asideDescription ?? description}
                </p>
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}