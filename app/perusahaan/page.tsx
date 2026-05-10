"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Target, 
  Rocket, 
  Users2, 
  Mail, 
  MapPin, 
  Phone,
  ArrowRight,
  Globe,
  Store,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/ui/animated-background";

// Custom Social Icons since lucide-react v1.14.0 doesn't have them
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const developers = [
  { 
    name: "Muhamad Nur Arif", 
    role: "Lead Developer & Fullsatack Developer", 
    github: "arifsuz", 
    instagram: "ariftsx", 
    portfolio: "ariftsx.vercel.app",
    image: "/images/profilArif.jpg"
  },
  { 
    name: "Muhamad Riski Purwanto", 
    role: "UI/UX Designer & Frontend Developer", 
    github: "boms-s", 
    instagram: "rskiprwnt_",
    image: "/images/profil.png"
  },
];

export default function PerusahaanPage() {
  return (
    <main className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AnimatedBackground />
      
      {/* Header Nav */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-white  flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain p-1" />
          </div>
          <span className="text-xl font-bold text-slate-950 dark:text-white">Smart Kantin</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
          Kembali ke Beranda
        </Link>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Mission Section */}
        <div className="grid gap-16 lg:grid-cols-2 items-center mb-32">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
            >
              Tentang Kami
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1]"
            >
              Mendigitalkan <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Ekosistem Kantin Indonesia</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              Lahir dari kebutuhan akan antrean yang lebih efisien di lingkungan pendidikan, Smart Kantin kini menjadi pionir dalam solusi <span style={{ fontWeight: 'bold' }}>Smart Catering</span> dan <span style={{ fontWeight: 'bold' }}>Digital Payments</span> untuk kantin sekolah dan universitas.
            </motion.p>

            <div className="mt-12 space-y-8">
              {developers.map((dev, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center p-6 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200 dark:bg-slate-900/40 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                >
                  <div className="relative group/avatar shrink-0">
                    <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover/avatar:opacity-40 transition-opacity" />
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                      <img src={dev.image} alt={dev.name} className="h-full w-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" />
                    </div>
                  </div>
                  
                  <div className="ml-6 sm:ml-10 flex flex-col justify-center flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white leading-tight">{dev.name}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mt-2 mb-6">{dev.role}</p>
                    
                    <div className="flex gap-3">
                      <Link href={`https://github.com/${dev.github}`} target="_blank" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-100 dark:border-white/5">
                        <GithubIcon className="h-5 w-5" />
                      </Link>
                      <Link href={`https://instagram.com/${dev.instagram}`} target="_blank" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-pink-600 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-100 dark:border-white/5">
                        <InstagramIcon className="h-5 w-5" />
                      </Link>
                      {dev.portfolio && (
                        <Link href={`https://${dev.portfolio}`} target="_blank" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm border border-slate-100 dark:border-white/5">
                          <Globe className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/20 overflow-hidden relative group">
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <img src="/images/logoKP.png" alt="Logo" className="w-full h-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-white font-bold text-2xl italic">"Teknologi bukan hanya soal kode, tapi soal mempermudah interaksi manusia."</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section: Kemitraan & Panduan */}
        <div className="grid gap-8 md:grid-cols-2 mb-32">
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 rounded-[2.5rem] border border-slate-200 bg-white/50 dark:border-white/5 dark:bg-slate-900/40"
          >
            <Store className="h-10 w-10 text-blue-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">Kemitraan Kantin</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Punya bisnis kuliner di lingkungan sekolah atau kampus? Bergabunglah sebagai mitra dan tingkatkan efisiensi penjualan Anda.
            </p>
            <Link href="/penjual/register" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:gap-3 transition-all">
              Daftar Jadi Mitra <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 rounded-[2.5rem] border border-slate-200 bg-white/50 dark:border-white/5 dark:bg-slate-900/40"
          >
            <Sparkles className="h-10 w-10 text-indigo-600 mb-6" />
            <h3 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">Edukasi Digital</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Pelajari bagaimana Smart Kantin mengubah cara transaksi konvensional menjadi lebih cerdas dan modern untuk ekosistem yang lebih baik.
            </p>
            <Link href="/produk" className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:gap-3 transition-all">
              Lihat Keunggulan <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Section: Kontak */}
        <div id="kontak" className="rounded-[3rem] bg-white border border-slate-200 shadow-xl dark:border-white/5 dark:bg-slate-900/60 p-10 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-950 dark:text-white mb-8">Hubungi Kami</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-12">Punya pertanyaan atau ingin bekerja sama? Tim kami siap membantu Anda kapan saja.</p>
              
              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email", value: "halo@kantinpintar.id" },
                  { icon: Phone, label: "Telepon", value: "+62 851 1774 2909" },
                  { icon: MapPin, label: "Kantor", value: "Gedung Kantin Pintar, Jakarta Selatan" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-slate-950 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nama Lengkap</label>
                  <input type="text" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 transition-all dark:border-white/10 dark:bg-slate-800" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                  <input type="email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 transition-all dark:border-white/10 dark:bg-slate-800" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Pesan</label>
                <textarea rows={4} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-blue-500 transition-all dark:border-white/10 dark:bg-slate-800" placeholder="Bagaimana kami bisa membantu?" />
              </div>
              <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
