"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/app/api/actions";
import { AuthShell } from "@/components/ui/auth-shell";

export default function penjualLogin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAction({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success || !result.user) {
        setError(result.message || "Email atau password salah.");
        return;
      }

      if (result.user.role === "PENJUAL") {
        router.replace("/penjual/dashboard");
      } else if (result.user.role === "PEMBELI") {
        router.replace("/pembeli/dashboard");
      } else {
        router.replace("/admin/dashboard");
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
      badge="Akses penjual"
      title="Dashboard penjual yang lebih terarah"
      description="Masuk untuk mengelola pesanan, memperbarui menu, dan memantau penjualan dengan lebih jelas."
      accent="purple"
      asideTitle="Masuk sebagai penjual"
      asideDescription="Akun penjual digunakan untuk melihat pesanan masuk, mengelola menu, dan memantau performa toko."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email penjual"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          {loading ? "Memverifikasi..." : "Login penjual"}
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          Belum punya akun?{" "}
          <Link href="/penjual/register" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200">
            Daftar di sini
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}