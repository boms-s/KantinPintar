"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PembeliUser } from "@/lib/types";
import { userStorage } from "@/lib/storage";
import { User, Mail, Phone, MapPin, Save, Edit2 } from "lucide-react";

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<PembeliUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PembeliUser>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = userStorage.get();
    if (!currentUser) {
      router.push("/pembeli/login");
      return;
    }
    setUser(currentUser);
    setFormData(currentUser);
    setIsLoading(false);
  }, [router]);

  const handleSave = () => {
    if (user) {
      const updatedUser: PembeliUser = {
        ...user,
        fullName: formData.fullName || user.fullName,
        email: formData.email || user.email,
        phone: formData.phone || user.phone,
        address: formData.address || user.address,
      };
      userStorage.set(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    }
  };

  if (isLoading || !user) {
    return <div className="p-6 flex items-center justify-center h-96"><p>Loading...</p></div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil Saya</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-blue-700 p-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
              <p className="text-blue-100">Akun Pembeli</p>
            </div>
          </div>
        </div>
        <div className="p-8">
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="081234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat</label>
                <textarea
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
                >
                  <Save size={18} />
                  Simpan
                </button>
                <button
                  onClick={() => { setIsEditing(false); setFormData(user); }}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-1">Nama Lengkap</p>
                <p className="text-lg font-bold text-gray-900">{user.fullName}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-1">Email</p>
                <p className="text-lg font-bold text-gray-900">{user.email}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-1">Nomor Telepon</p>
                <p className="text-lg font-bold text-gray-900">{user.phone || "Belum diatur"}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-1">Alamat</p>
                <p className="text-lg font-bold text-gray-900">{user.address || "Belum diatur"}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 mt-6"
              >
                <Edit2 size={18} />
                Edit Profil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}