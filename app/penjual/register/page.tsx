"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PenjualRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
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
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/penjual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: "",
        }),
      });

      const raw = await response.text();
      let data: { error?: string; token?: string; seller?: unknown } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Server mengembalikan response tidak valid.");
      }

      if (!response.ok) {
        setError(data.error || "Registrasi gagal. Silakan coba lagi.");
        return;
      }

      // Save token and seller data to localStorage
      if (data.token) {
        localStorage.setItem("sellerToken", data.token);
        localStorage.setItem("seller", JSON.stringify(data.seller));
      }

      // Redirect ke dashboard penjual
      router.push("/penjual/dashboard");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-600 mb-2">Daftar Penjual</h1>
        <p className="text-gray-500 text-sm mb-6">Buat akun untuk mulai jualan di Smart Kantin</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="fullName" placeholder="Nama Lengkap" onChange={handleChange} className="w-full border p-3 rounded" required />

          <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full border p-3 rounded" required />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-3 rounded" required />

          <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded font-semibold">{loading ? "Mendaftar..." : "Daftar"}</button>
        </form>

        <p className="text-center text-sm mt-6">Sudah punya akun? <Link href="/penjual/login" className="text-purple-600 font-bold">Login di sini</Link></p>
      </div>
    </div>
  );
}