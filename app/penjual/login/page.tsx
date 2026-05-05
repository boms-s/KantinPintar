"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { penjualSession, penjualStorage } from "@/lib/storage";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const penjuals = penjualStorage.getAll();

      const inputEmail = (formData.email || "").trim().toLowerCase();
      const inputPassword = (formData.password || "").trim();

      const penjual = penjuals.find((s: any) => {
        const storedEmail = (s.email || "").trim().toLowerCase();
        const storedPassword = (s.password || "").trim();
        return storedEmail === inputEmail && storedPassword === inputPassword;
      });

      if (!penjual) {
        console.debug("penjuals found:", penjuals);
        console.debug("login attempt:", { email: formData.email });
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }

      penjualSession.set({
        id: penjual.id || penjual.email,
        fullName: penjual.fullName || penjual.name || penjual.email,
        email: penjual.email,
        role: "penjual",
      } as any);

      // clear other roles if present
      try {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentAdmin");
      } catch {}

      router.replace("/penjual/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-600 mb-2">Login Penjual</h1>
        <p className="text-gray-500 text-sm mb-6">Masuk untuk mengelola pesanan</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-3 rounded" required />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-3 rounded" required />

          <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Belum punya akun? <Link href="/penjual/register" className="text-purple-600 font-bold">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}