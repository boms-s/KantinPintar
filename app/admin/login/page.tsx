"use client";

import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_CREDENTIALS } from "@/lib/adminCredentials";
import { userStorage, penjualSession } from "@/lib/storage";
import { AuthShell } from "@/components/ui/auth-shell";

export default function AdminLoginPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        if (
          formData.email === ADMIN_CREDENTIALS.email &&
          formData.password === ADMIN_CREDENTIALS.password
        ) {
          localStorage.setItem(
            "currentAdmin",
            JSON.stringify({
              email: ADMIN_CREDENTIALS.email,
              fullName: ADMIN_CREDENTIALS.fullName,
              role: "admin",
            })
          );

          // 🔥 FIX: bersihin semua role lain
          try { userStorage.clear(); } catch {}
          penjualSession.clear();

          router.push("/admin/dashboard");
        } else {
          setError("Email atau password admin salah.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat login.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <AuthShell
      badge="Portal admin"
      title="Panel admin dengan akses yang lebih tegas"
      description="Masuk untuk mengelola sistem, memeriksa data, dan menjaga platform tetap rapi dari satu titik kontrol."
      accent="red"
      asideTitle="Akses admin"
      asideDescription="Gunakan kredensial admin untuk membuka panel pengelolaan sistem dan menyusun kontrol operasional."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email Admin</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@kantinpintar.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-red-500 dark:focus:ring-red-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          Ingat sesi admin ini
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {loading ? "Memverifikasi..." : "Masuk admin"}
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          <Link href="/" className="font-semibold text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200">
            ← Kembali ke beranda
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}