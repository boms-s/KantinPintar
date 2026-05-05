"use client";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { userStorage, penjualSession } from "@/lib/storage";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      try {
        const usersRaw = localStorage.getItem("users") || "[]";
        const users = JSON.parse(usersRaw);

        const user = users.find(
          (u: any) =>
            u.email === formData.email &&
            u.password === formData.password
        );

        if (!user) {
          setError("Email atau password salah.");
          setLoading(false);
          return;
        }

        // Simpan user login dengan key yang dipakai dashboard
        userStorage.set({
          id: user.id || user.email,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          address: user.address,
          role: "pembeli",
        });

        // Bersihin role lain
        try {
          localStorage.removeItem("currentAdmin");
        } catch {}
        penjualSession.clear();

        // Redirect ke dashboard pembeli
        router.push("/pembeli/dashboard");
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
      style={{ background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eff6ff 100%)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
            🍽️
          </div>
          <span className="font-bold">
            SMART <span className="text-gray-500">KANTIN</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold mb-2 text-blue-600">
          Login Pembeli
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Masuk untuk memesan makanan favoritmu
        </p>

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
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-12 pr-4 py-3 border rounded-lg"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 border rounded-lg"
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm mt-6">
          Belum punya akun?{" "}
          <Link href="/pembeli/register" className="text-blue-600 font-bold">
            Daftar di sini
          </Link>
        </p>

      </div>
    </div>
  );
}