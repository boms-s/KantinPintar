"use client";

import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

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
    setError("");
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
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

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/pembeli", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: "",
        }),
      });

      const raw = await response.text();
      let data: { error?: string; token?: string; user?: unknown } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("Server mengembalikan response tidak valid.");
      }

      if (!response.ok) {
        setError(data.error || "Registrasi gagal. Silakan coba lagi.");
        return;
      }

      // Save token and user data to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect ke dashboard pembeli
      router.push("/pembeli/dashboard");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT - FORM */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 lg:p-12">
            
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                🍽️
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                SMART <span className="text-gray-600 dark:text-gray-400">KANTIN</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Bergabunglah dengan
              </p>
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-blue-600">SMART</span>{" "}
                <span className="text-gray-900 dark:text-white">KANTIN</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Daftar sekarang dan nikmati kemudahan memesan makanan kantin.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              
              {/* Nama */}
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 border rounded-lg"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nomor Telepon"
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

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi Password"
                  className="w-full pl-12 pr-12 py-3 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-3.5"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                />
                Saya setuju dengan{" "}
                <Link href="#" className="text-blue-600">
                  Syarat & Ketentuan
                </Link>
              </label>

              {/* Button */}
              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Mendaftar..." : "Buat Akun"}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm">
              Sudah punya akun?{" "}
              <Link href="/pembeli/login" className="text-blue-600 font-bold">
                Login di sini
              </Link>
            </p>
          </div>

          {/* RIGHT - IMAGE / VISUAL */}
          <div className="hidden lg:flex justify-center">
            <Image
              src="/next.svg"
              alt="Ilustrasi login pembeli"
              width={400}
              height={400}
              className="w-100 h-auto"
            />
          </div>

        </div>
      </div>
    </div>
  );
}