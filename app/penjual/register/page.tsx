"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerPenjualAction } from "@/app/api/actions";
import { AuthShell } from "@/components/ui/auth-shell";

export default function penjualRegister() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.businessName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.password) {
      setError("Harap isi semua field yang diperlukan.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    if (!formData.terms) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
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
      return;
    }

    router.push("/penjual/dashboard");
  };

  return (
    <AuthShell
      badge="Daftar penjual"
      title="Bangun toko penjual dengan tampilan yang lebih serius"
      description="Daftar untuk mengelola menu, menerima pesanan, dan menata profil toko di satu tempat yang lebih modern."
      accent="purple"
      asideTitle="Gabung sebagai penjual"
      asideDescription="Setelah daftar, akun penjual dapat langsung dipakai untuk login dan mengelola operasional menu."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
            <input
              type="text"
              name="username"
              placeholder="username unik"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nama Toko</label>
            <input
              type="text"
              name="businessName"
              placeholder="Nama bisnis / kantin"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email toko"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Nomor Telepon</label>
            <input
              type="tel"
              name="phone"
              placeholder="08xxxxxxxxxx"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Alamat</label>
            <textarea
              name="address"
              placeholder="Alamat lengkap toko"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Kota</label>
            <input
              type="text"
              name="city"
              placeholder="Kota domisili"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Ulangi password"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-violet-500 dark:focus:ring-violet-500/20"
              required
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
            <span>Saya setuju dengan Syarat & Ketentuan</span>
          </label>
        </div>

        <button className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
          Daftar penjual
        </button>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          Sudah punya akun?{" "}
          <Link href="/penjual/login" className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-300 dark:hover:text-violet-200">
            Login di sini
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}