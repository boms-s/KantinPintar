"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, X, Clock3, MapPin, Mail, Upload } from "lucide-react";

import { getCurrentUserAction, updatePenjualProfileAction } from "@/app/api/actions";

type SellerProfile = {
  id: string;
  email: string;
  penjual?: {
    id: string;
    businessName: string;
    address: string;
    city: string;
    isOpen: boolean;
    operatingHours?: string | null;
    description?: string | null;
    photoUrl?: string | null;
  } | null;
};

export default function ProfilPage() {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [description, setDescription] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadSession = async () => {
      const result = await getCurrentUserAction();

      if (!result.success || !result.data || result.data.role !== "PENJUAL") {
        setSeller(null);
        return;
      }

      const current = result.data as SellerProfile;
      setSeller(current);
      
      if (current.penjual) {
        setDescription(current.penjual.description || "");
        setOperatingHours(current.penjual.operatingHours || "");
        setIsOpen(current.penjual.isOpen);
        setPhotoPreview(current.penjual.photoUrl || "/default-avatar.png");
      }
    };

    loadSession();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      let photoUrl = seller?.penjual?.photoUrl;

      // Upload photo if changed
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);

        const uploadRes = await fetch("/api/upload-profile-image", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          setMessage("Gagal upload foto: " + uploadData.message);
          setIsSaving(false);
          return;
        }

        photoUrl = uploadData.imageUrl;
      }

      // Update profile
      const result = await updatePenjualProfileAction({
        description: description.trim() || undefined,
        operatingHours: operatingHours.trim() || undefined,
        isOpen,
        photoUrl,
      });

      setIsSaving(false);

      if (!result.success) {
        setMessage(result.message || "Gagal menyimpan profil");
        return;
      }

      // Update local state
      setSeller((current) =>
        current
          ? {
              ...current,
              penjual: current.penjual
                ? {
                    ...current.penjual,
                    description,
                    operatingHours,
                    isOpen,
                    photoUrl: photoUrl || current.penjual.photoUrl,
                  }
                : current.penjual,
            }
          : current,
      );

      setPhotoFile(null);
      setIsEditModalOpen(false);
      setMessage("Profil berhasil diperbarui");

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setIsSaving(false);
      setMessage("Terjadi kesalahan saat menyimpan profil");
    }
  };

  if (!seller) return <div className="p-6">Silakan login sebagai penjual.</div>;

  const sellerProfile = seller.penjual;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Profil Penjual</h1>
            <p className="mt-1 text-sm text-slate-600">
              Kelola informasi toko dan status operasional.
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Pencil className="h-4 w-4" /> Edit Profil
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow">
              <div className="mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full bg-slate-100 relative">
                <Image
                  src={sellerProfile?.photoUrl || "/default-avatar.png"}
                  alt={sellerProfile?.businessName || "Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {sellerProfile?.businessName || "-"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{seller.email || "-"}</p>
              <p className="mt-2 text-sm text-slate-500 flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                {sellerProfile?.address || "-"}, {sellerProfile?.city || "-"}
              </p>
            </div>
          </div>

          <div className="col-span-2 space-y-6">
            {/* Status Warung */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Status Warung</p>
                  <p
                    className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                      sellerProfile?.isOpen
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                  >
                    {sellerProfile?.isOpen ? "Buka" : "Tutup"}
                  </p>
                </div>
              </div>
            </div>

            {/* Deskripsi Bisnis */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                Deskripsi Bisnis
              </h3>
              <p className="text-sm text-slate-600">
                {sellerProfile?.description ||
                  "Belum ada deskripsi. Klik tombol Edit Profil untuk menambahkan."}
              </p>
            </div>

            {/* Jam Operasional */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow">
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                Jam Operasional
              </h3>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock3 className="h-5 w-5 text-slate-400" />
                <span>
                  {sellerProfile?.operatingHours || "Belum ditentukan"}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Nama Toko</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {sellerProfile?.businessName || "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {seller.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Edit Profil</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {message && (
                <div
                  className={`p-4 rounded-lg text-sm font-medium ${
                    message.includes("berhasil")
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Foto Profil
                </label>
                <div className="flex items-center gap-6">
                  <div className="h-28 w-28 rounded-full overflow-hidden bg-slate-100 relative shrink-0">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-lg font-semibold cursor-pointer hover:bg-slate-800 transition-colors">
                      <Upload className="h-4 w-4" />
                      Upload Foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-slate-500">
                      Maks. 5MB, format JPG/PNG
                    </p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Deskripsi Bisnis
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan tentang bisnis Anda..."
                  maxLength={500}
                  className="w-full h-28 rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {description.length}/500
                </p>
              </div>

              {/* Jam Operasional */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Jam Operasional
                </label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="Contoh: Senin-Jumat 08:00-17:00, Sabtu 09:00-15:00"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Tulis format sesuai jam buka Anda
                </p>
              </div>

              {/* Status Warung */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Status Warung
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsOpen(true)}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                      isOpen
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Buka
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                      !isOpen
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg text-slate-700 font-semibold border border-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg bg-slate-950 text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
