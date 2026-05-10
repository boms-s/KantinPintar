"use client";

import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { loginAction } from "@/app/api/actions";
import { AuthShell } from "@/components/ui/auth-shell";

const formVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function LoginPembeli() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginAction({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success || !result.user) {
        setError(result.message || "Email atau password salah.");
        return;
      }

      if (result.user.role === "PEMBELI") {
        router.push("/pembeli/dashboard");
      } else if (result.user.role === "PENJUAL") {
        router.push("/penjual/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="Portal Pembeli"
      title="Selamat Datang Kembali di Smart Kantin"
      description="Nikmati kemudahan memesan makanan tanpa perlu mengantre lama. Cukup masuk, pilih, dan ambil!"
      accent="blue"
      asideTitle="Akses Akun Pembeli"
      asideDescription="Gunakan kredensial Anda untuk masuk ke sistem pemesanan cerdas kami."
    >
      <motion.form 
        variants={formVariants}
        initial="hidden"
        animate="show"
        onSubmit={handleSubmit} 
        className="space-y-6"
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

        <div className="space-y-5">
          <motion.div variants={itemVariants}>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative group">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between">
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
              <Link href="#" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Lupa password?</Link>
            </div>
            <div className="relative group">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3.5 pr-12 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-900"
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
        </div>

        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700"
          />
          <label htmlFor="remember" className="text-sm font-medium text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            Ingat saya di perangkat ini
          </label>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></span>
              Sedang Memverifikasi...
            </span>
          ) : (
            <>
              Login Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </motion.button>

        <motion.div variants={itemVariants} className="pt-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Belum memiliki akun?{" "}
            <Link href="/pembeli/register" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Daftar Gratis
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthShell>
  );
}