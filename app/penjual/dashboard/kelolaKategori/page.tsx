"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction, getSellerCategoriesAction, createMenuCategoryAction, updateMenuCategoryAction, deleteMenuCategoryAction } from "@/app/api/actions";

interface Category {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	_count?: {
		menus: number;
	};
}

interface FormData {
	id: string;
	name: string;
	description: string;
	icon: string;
}

export default function KelolaKategoriPage() {
	const router = useRouter();
	const [seller, setSeller] = useState<any>(null);
	const [penjualId, setPenjualId] = useState<string>("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [showForm, setShowForm] = useState(false);

	const [form, setForm] = useState<FormData>({
		id: "",
		name: "",
		description: "",
		icon: "",
	});

	useEffect(() => {
		async function loadData() {
			try {
				const userRes = await getCurrentUserAction();
				const sellerProfileId = userRes.data?.penjual?.id;
				if (!userRes.success || userRes.data?.role !== "PENJUAL" || !sellerProfileId) {
					router.push("/penjual/login");
					return;
				}
				setSeller(userRes.data);
				setPenjualId(sellerProfileId);

				const catsRes = await getSellerCategoriesAction(sellerProfileId);
				if (catsRes.success) {
					setCategories(catsRes.data || []);
				}
			} catch (err) {
				console.error(err);
				setError("Gagal memuat data");
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, [router]);

	if (loading) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
					<p className="mt-4 text-slate-600">Memuat data...</p>
				</div>
			</div>
		);
	}

	if (!seller) {
		return (
			<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
				<div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
					<h2 className="text-2xl font-bold text-slate-800 mb-2">Akses Ditolak</h2>
					<p className="text-slate-600 mb-6">Silakan login sebagai penjual terlebih dahulu</p>
					<button onClick={() => router.push("/penjual/login")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">Login</button>
				</div>
			</div>
		);
	}

	function resetForm() {
		setForm({ id: "", name: "", description: "", icon: "" });
		setError("");
		setShowForm(false);
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!form.name.trim()) {
			setError("Nama kategori harus diisi");
			return;
		}

		setSubmitting(true);

		try {
			if (form.id) {
				const res = await updateMenuCategoryAction(form.id, penjualId, {
					name: form.name,
					description: form.description || undefined,
					icon: form.icon || undefined,
				});
				if (res.success) {
					setSuccess("Kategori berhasil diperbarui");
					const catsRes = await getSellerCategoriesAction(penjualId);
					if (catsRes.success) {
						setCategories(catsRes.data || []);
					}
					resetForm();
				} else {
					setError(res.message || "Gagal memperbarui kategori");
				}
			} else {
				const res = await createMenuCategoryAction(penjualId, {
					name: form.name,
					description: form.description || undefined,
					icon: form.icon || undefined,
				});
				if (res.success) {
					setSuccess("Kategori berhasil ditambahkan");
					const catsRes = await getSellerCategoriesAction(penjualId);
					if (catsRes.success) {
						setCategories(catsRes.data || []);
					}
					resetForm();
				} else {
					setError(res.message || "Gagal menambahkan kategori");
				}
			}
		} catch (err) {
			console.error(err);
			setError("Terjadi kesalahan saat menyimpan kategori");
		} finally {
			setSubmitting(false);
		}
	}

	function onEdit(cat: Category) {
		setForm({
			id: cat.id,
			name: cat.name,
			description: cat.description || "",
			icon: cat.icon || "",
		});
		setError("");
		setSuccess("");
		setShowForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function onDelete(id: string) {
		if (!confirm("Yakin ingin menghapus kategori ini?")) return;
		try {
			const res = await deleteMenuCategoryAction(id, penjualId);
			if (res.success) {
				setSuccess("Kategori berhasil dihapus");
				const catsRes = await getSellerCategoriesAction(penjualId);
				if (catsRes.success) {
					setCategories(catsRes.data || []);
				}
			} else {
				setError(res.message || "Gagal menghapus kategori");
			}
		} catch (err) {
			console.error(err);
			setError("Gagal menghapus kategori");
		}
	}

	const iconOptions = ["🍜", "🥤", "🍪", "🍰", "📦"];

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Kelola Kategori</h1>
						<p className="text-slate-600 mt-1">Atur kategori menu untuk bisnis Anda</p>
					</div>
					<button 
						onClick={() => router.push('/penjual/dashboard')} 
						className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
					>
						← Kembali
					</button>
				</div>

				{/* Alerts */}
				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-start">
						<svg className="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
						<div>{error}</div>
					</div>
				)}
				{success && (
					<div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-start">
						<svg className="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<div>{success}</div>
					</div>
				)}

				{/* Categories List Section */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-slate-900">Daftar Kategori ({categories.length})</h2>
						{!showForm && (
							<button 
								onClick={() => {
									resetForm();
									setShowForm(true);
								}}
								className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
								</svg>
								Tambah Kategori
							</button>
						)}
					</div>

					{categories.length === 0 ? (
						<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
							<svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							<p className="text-slate-600 text-lg">Belum ada kategori yang dibuat</p>
							<p className="text-slate-500 text-sm mt-2">Buat kategori pertama untuk mengorganisir menu Anda</p>
							<button 
								onClick={() => {
									resetForm();
									setShowForm(true);
								}}
								className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition inline-flex items-center gap-2"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
								</svg>
								Buat Kategori Pertama
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{categories.map((cat) => (
								<div key={cat.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
									<div className="h-32 bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center">
										<span className="text-6xl">{cat.icon || "📦"}</span>
									</div>
									<div className="p-4">
										<h3 className="font-bold text-slate-900 text-lg mb-2">{cat.name}</h3>
										{cat.description && (
											<p className="text-sm text-slate-600 mb-3 line-clamp-2">{cat.description}</p>
										)}
										<div className="mb-4 text-sm text-slate-600">
											<span className="font-medium text-slate-900">{cat._count?.menus || 0}</span> menu menggunakan kategori ini
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-4 border-t border-slate-200">
											<button 
												onClick={() => onEdit(cat)}
												className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition text-sm"
											>
												✎ Edit
											</button>
											<button 
												onClick={() => onDelete(cat.id)}
												disabled={(cat._count?.menus || 0) > 0}
												className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 disabled:bg-slate-100 text-red-700 disabled:text-slate-500 font-semibold rounded-lg transition text-sm disabled:cursor-not-allowed"
												title={(cat._count?.menus || 0) > 0 ? "Tidak bisa menghapus kategori yang masih memiliki menu" : "Hapus kategori"}
											>
												🗑 Hapus
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Form Section - Hidden by default */}
				{showForm && (
					<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-slate-900">{form.id ? "Edit Kategori" : "Tambah Kategori Baru"}</h2>
							<button 
								onClick={() => resetForm()}
								className="p-2 hover:bg-slate-100 rounded-lg transition"
								title="Tutup form"
							>
								<svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<form onSubmit={onSubmit} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Nama Kategori */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Nama Kategori *</label>
									<input 
										type="text"
										value={form.name}
										onChange={(e) => setForm({...form, name: e.target.value})}
										placeholder="Contoh: Makanan Utama"
										className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
										required
									/>
								</div>

								{/* Icon/Emoji */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Icon</label>
									<div className="flex gap-2">
										{iconOptions.map((icon) => (
											<button
												key={icon}
												type="button"
												onClick={() => setForm({...form, icon})}
												className={`flex-1 py-2 text-2xl rounded-lg border-2 transition ${form.icon === icon ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-blue-300'}`}
											>
												{icon}
											</button>
										))}
										<input 
											type="text"
											maxLength={2}
											value={form.icon}
											onChange={(e) => setForm({...form, icon: e.target.value})}
											placeholder="Atau custom"
											className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
										/>
									</div>
								</div>
							</div>

							{/* Deskripsi */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
								<textarea 
									value={form.description}
									onChange={(e) => setForm({...form, description: e.target.value})}
									placeholder="Jelaskan kategori ini..."
									rows={3}
									className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
								/>
							</div>

							{/* Buttons */}
							<div className="flex gap-3 pt-4">
								<button 
									type="submit"
									disabled={submitting}
									className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
								>
									{submitting && <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
									{form.id ? "Simpan Perubahan" : "Buat Kategori"}
								</button>
								<button 
									type="button"
									onClick={resetForm}
									className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
								>
									Batal
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
