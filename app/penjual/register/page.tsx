"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Store, Mail, Phone, MapPin, Map, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { registerPenjualAction } from "@/app/api/actions";
import { AuthShell } from "@/components/ui/auth-shell";

const formVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export default function RegisterPenjual() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    businessName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.username || !formData.businessName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.password) {
      setError("Harap isi semua field yang diperlukan.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      setLoading(false);
      return;
    }

    const result = await registerPenjualAction({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      businessName: formData.businessName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
    });

    if (!result.success) {
      setError(result.message || "Registrasi gagal");
      setLoading(false);
      return;
    }

    router.push("/penjual/dashboard");
  };

  return (
    <AuthShell
      badge="Pendaftaran Mitra Penjual"
      title="Buka Pintu Kesuksesan Bisnis Kuliner Anda"
      description="Kelola menu digital, terima pesanan otomatis, dan pantau pertumbuhan bisnis Anda dalam satu platform cerdas."
      accent="purple"
      asideTitle="Daftar Menjadi Mitra"
      asideDescription="Lengkapi informasi bisnis Anda untuk mulai berjualan di Smart Kantin."
    >
      <motion.form 
        variants={formVariants}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit} 
        className="space-y-8"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
          >
            <div className="h-2 w-2 rounded-full bg-red-500" />
            {error}
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Section: Akun Utama */}
          <div className="space-y-5">
            <motion.div variants={itemVariants} className="flex items-center gap-2 pb-2">
              <span className="h-4 w-1 rounded-full bg-violet-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Informasi Akun</h3>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Username</label>
                <div className="relative group">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="mitra_kantin"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Bisnis</label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="bisnis@email.com"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Section: Detail Bisnis */}
          <div className="space-y-5 pt-4">
            <motion.div variants={itemVariants} className="flex items-center gap-2 pb-2">
              <span className="h-4 w-1 rounded-full bg-violet-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Detail Bisnis</h3>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nama Toko/Kantin</label>
                <div className="relative group">
                  <Store className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Kantin Sejahtera"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Nomor Telepon</label>
                <div className="relative group">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0812xxxxxx"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Kota</label>
                <div className="relative group">
                  <Map className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Jakarta Selatan"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Alamat Lengkap</label>
                <div className="relative group">
                  <MapPin className="pointer-events-none absolute left-4 top-5 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Alamat lengkap lokasi kantin"
                    required
                    rows={1}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Section: Keamanan */}
          <div className="space-y-5 pt-4">
            <motion.div variants={itemVariants} className="flex items-center gap-2 pb-2">
              <span className="h-4 w-1 rounded-full bg-violet-500"></span>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Keamanan Akun</h3>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Konfirmasi Password</label>
                <div className="relative group">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors group-focus-within:text-violet-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
          />
          <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-relaxed">
            Saya menyetujui <Link href="#" className="font-bold text-violet-600 hover:underline">Perjanjian Kemitraan</Link> serta <Link href="#" className="font-bold text-violet-600 hover:underline">Kebijakan Privasi</Link> Smart Kantin.
          </label>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-violet-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 hover:shadow-xl disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              Sedang Mendaftarkan Toko...
            </span>
          ) : (
            <>
              Daftar Sebagai Mitra
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        <motion.div variants={itemVariants} className="pt-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sudah memiliki akun mitra?{" "}
            <Link href="/penjual/login" className="font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300">
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthShell>
  );
}