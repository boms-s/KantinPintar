"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { penjualStorage } from "@/lib/storage";

export default function penjualRegister() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const penjuals = penjualStorage.getAll();

    // cek email sudah ada
    const exist = penjuals.find((s: any) => s.email === formData.email);

    if (exist) {
      setError("Email sudah terdaftar!");
      return;
    }

    // simpan penjual baru
    penjualStorage.add({
      id: crypto.randomUUID(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: "penjual",
    } as any);

    // redirect ke login
    router.push("/penjual/login");
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

          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded font-semibold">Daftar</button>
        </form>

        <p className="text-center text-sm mt-6">Sudah punya akun? <Link href="/penjual/login" className="text-purple-600 font-bold">Login di sini</Link></p>
      </div>
    </div>
  );
}