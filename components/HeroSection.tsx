"use client";

import Link from "next/link";
import { ArrowRight, Rocket, UtensilsCrossed, Soup, CupSoda } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden px-6 pt-24"
    >
      <motion.div style={{ opacity }} className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <img src="/images/logoKP.png" alt="Logo Kantin Pintar" className="h-60 w-auto object-contain" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-white/40 px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-md dark:border-blue-500/30 dark:bg-slate-900/40 dark:text-blue-300"
        >
          <Rocket className="h-4 w-4" />
          <span>Cara Baru Jajan di Kantin</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-balance text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl md:text-8xl dark:text-white"
        >
          Pesan Makan <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
            Tanpa Antre
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-slate-600 sm:text-xl dark:text-slate-300"
        >
          Nikmati kemudahan memesan makanan favoritmu kapan saja. Solusi digital terbaik untuk ekosistem kantin yang lebih cepat, transparan, dan efisien.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/pembeli/login"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] dark:bg-white dark:text-slate-950 dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Mulai Pesan Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          <Link
            href="/penjual/login"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/50 px-8 py-4 text-sm font-semibold text-slate-700 backdrop-blur-md transition-all hover:border-blue-300 hover:bg-white hover:text-blue-700 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            Masuk sebagai penjual
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating 3D-like Cards */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute left-[5%] top-[20%] hidden md:block lg:left-[10%]"
      >
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/40 bg-white/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-lg dark:border-white/10 dark:bg-slate-800/40"
        >
          <UtensilsCrossed className="h-14 w-14 text-orange-500 drop-shadow-md" />
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-[15%] right-[5%] hidden md:block lg:right-[15%]"
      >
        <motion.div 
          animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="flex h-40 w-40 items-center justify-center rounded-3xl border border-white/40 bg-white/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-lg dark:border-white/10 dark:bg-slate-800/40"
        >
          <Soup className="h-20 w-20 text-yellow-500 drop-shadow-md" />
        </motion.div>
      </motion.div>

      <motion.div 
        style={{ y: y1 }}
        className="absolute right-[10%] top-[25%] hidden xl:block"
      >
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/40 bg-white/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-lg dark:border-white/10 dark:bg-slate-800/40"
        >
          <CupSoda className="h-10 w-10 text-sky-500 drop-shadow-md" />
        </motion.div>
      </motion.div>
    </section>
  );
}
