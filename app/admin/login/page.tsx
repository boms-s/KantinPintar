"use client";

import { Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_CREDENTIALS } from "@/lib/adminCredentials";
import { userStorage, penjualSession } from "@/lib/storage";

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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fff1f2 100%)" }}
    >
      
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500">Kantin Pintar</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@kantin.com"
              className="w-full pl-12 pr-4 py-3 border rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 border rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            Ingat saya
          </label>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg"
          >
            {loading ? "Verifikasi..." : "Masuk Admin"}
          </button>
        </form>

        {/* Back */}
        <p className="text-center text-sm mt-6">
          <Link href="/" className="text-red-600 font-bold">
            ← Kembali ke Beranda
          </Link>
        </p>
      </div>
    </div>
  );
}