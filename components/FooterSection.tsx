import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="px-6 pb-10 pt-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200/80 bg-white/90 px-6 py-10 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.55)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Smart Kantin</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                Platform digital untuk memesan makanan kantin dengan alur yang lebih cepat, jelas, dan siap dikembangkan ke tahap produksi.
              </p>
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Next.js App Router • Tailwind • Prisma</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Menu</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Beranda</Link></li>
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Menu</Link></li>
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Tentang Kami</Link></li>
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Bantuan</h4>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">FAQ</Link></li>
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="transition hover:text-blue-600 dark:hover:text-blue-300">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Ikuti Kami</h4>
            <div className="flex gap-3">
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">f</a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">𝕏</a>
              <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-pink-300 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">📷</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          &copy; 2026 Smart Kantin. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
