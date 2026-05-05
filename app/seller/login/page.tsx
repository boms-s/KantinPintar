"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellerLogin() {
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
      const sellersRaw = localStorage.getItem("sellers") || "[]";
      const sellers = JSON.parse(sellersRaw);

      const seller = sellers.find(
        (s: any) =>
          s.email === formData.email &&
          s.password === formData.password
      );

      if (!seller) {
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "currentSeller",
        JSON.stringify({
          email: seller.email,
          fullName: seller.fullName,
          role: "seller",
        })
      );

      // bersihin role lain
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentAdmin");

      router.replace("/seller/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-600 mb-2">
          Login Penjual
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Masuk untuk mengelola pesanan
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Belum punya akun?{" "}
          <Link href="/seller/register" className="text-purple-600 font-bold">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}