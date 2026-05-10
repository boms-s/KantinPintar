"use client";

import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="relative z-10 w-full px-6 pb-6 pt-12">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-slate-200/60 bg-white/60 px-8 py-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40 lg:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1 shadow-lg shadow-blue-600/10 dark:bg-slate-800">
                <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Kantin Pintar </h3>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Platform ekosistem kantin digital masa depan. Merubah cara antre menjadi lebih cerdas, efisien, dan modern.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-sky-100 hover:text-sky-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-sky-900/50 dark:hover:text-sky-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-pink-100 hover:text-pink-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-pink-900/50 dark:hover:text-pink-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-slate-950 dark:text-white">Produk</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/produk" className="transition hover:text-blue-600 dark:hover:text-blue-400">Untuk Pembeli</Link></li>
              <li><Link href="/produk" className="transition hover:text-blue-600 dark:hover:text-blue-400">Untuk Penjual</Link></li>
              <li><Link href="/produk" className="transition hover:text-blue-600 dark:hover:text-blue-400">Harga & Paket</Link></li>
              <li><Link href="/produk" className="transition hover:text-blue-600 dark:hover:text-blue-400">Fitur Baru</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-slate-950 dark:text-white">Pengembang</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/perusahaan" className="transition hover:text-blue-600 dark:hover:text-blue-400">Tentang Kami</Link></li>
              <li><Link href="/perusahaan" className="transition hover:text-blue-600 dark:hover:text-blue-400">Kemitraan</Link></li>
              <li><Link href="/perusahaan#kontak" className="transition hover:text-blue-600 dark:hover:text-blue-400">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-slate-950 dark:text-white">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/legal" className="transition hover:text-blue-600 dark:hover:text-blue-400">Syarat & Ketentuan</Link></li>
              <li><Link href="/legal" className="transition hover:text-blue-600 dark:hover:text-blue-400">Kebijakan Privasi</Link></li>
              <li><Link href="/legal" className="transition hover:text-blue-600 dark:hover:text-blue-400">Keamanan</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 sm:flex-row dark:border-slate-800/60">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            &copy; 2026 Smart Kantin. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
