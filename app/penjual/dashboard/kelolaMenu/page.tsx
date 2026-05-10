"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/lib/types";
import { getCurrentUserAction, getSellerMenusAction, createMenuAction, updateMenuAction, deleteMenuAction, getSellerCategoriesAction, createMenuCategoryAction } from "@/app/api/actions";

type Category = { id: string; name: string };

interface FormData {
	id: string;
	name: string;
	description: string;
	price: string;
    cost: string;
	menuCategoryId: string;
	stockMode: "number" | "ready";
	stock: string;
	image: string;
	isAvailable: boolean;
}

interface MenuItemWithDetails extends MenuItem {
	menuCategoryId?: string;
	isAvailable?: boolean;
	stock?: number;
	description?: string;
}

export default function KelolaMenuPage() {
	const router = useRouter();
	type SellerSession = {
		id: string;
		role: string;
		penjual?: { id: string } | null;
	};
	const [seller, setSeller] = useState<SellerSession | null>(null);
	const [penjualId, setPenjualId] = useState("");
	const [menus, setMenus] = useState<MenuItemWithDetails[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [showQuickCategoryForm, setShowQuickCategoryForm] = useState(false);
	const [quickCategoryName, setQuickCategoryName] = useState("");
	const [quickCategoryDescription, setQuickCategoryDescription] = useState("");
	const [quickCategoryIcon, setQuickCategoryIcon] = useState("🍜");
	const [quickCategorySaving, setQuickCategorySaving] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	
	const [form, setForm] = useState<FormData>({ 
		id: "", 
		name: "", 
		description: "", 
		price: "", 
        cost: "",
		menuCategoryId: "", 
		stockMode: "number",
		stock: "", 
		image: "",
		isAvailable: true 
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

				const menusRes = await getSellerMenusAction(sellerProfileId);
				if (menusRes.success) {
					setMenus((menusRes.data || []) as MenuItemWithDetails[]);
				}

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
			setForm({ id: "", name: "", description: "", price: "", cost: "", menuCategoryId: "", stockMode: "number", stock: "", image: "", isAvailable: true });
		setPreviewImage("");
		setImageFile(null);
		setError("");
		setShowForm(false);
		setShowQuickCategoryForm(false);
		setQuickCategoryName("");
		setQuickCategoryDescription("");
		setQuickCategoryIcon("🍜");
	}

	async function handleQuickCategoryCreate() {
		if (!quickCategoryName.trim()) {
			setError("Nama kategori harus diisi");
			return;
		}

		setQuickCategorySaving(true);
		setError("");
		setSuccess("");

		try {
			const res = await createMenuCategoryAction(penjualId, {
				name: quickCategoryName.trim(),
				description: quickCategoryDescription.trim() || undefined,
				icon: quickCategoryIcon || undefined,
			});

			if (res.success) {
				setSuccess("Kategori berhasil ditambahkan");
				const catsRes = await getSellerCategoriesAction(penjualId);
				if (catsRes.success) {
					setCategories(catsRes.data || []);
				}
				setForm((current) => ({ ...current, menuCategoryId: res.data?.id || current.menuCategoryId }));
				setQuickCategoryName("");
				setQuickCategoryDescription("");
				setQuickCategoryIcon("🍜");
				setShowQuickCategoryForm(false);
			} else {
				setError(res.message || "Gagal menambahkan kategori");
			}
		} catch (err) {
			console.error(err);
			setError("Terjadi kesalahan saat menambahkan kategori");
		} finally {
			setQuickCategorySaving(false);
		}
	}

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setPreviewImage(result);
			};
			reader.readAsDataURL(file);
		}
	}

	async function uploadMenuImage(file: File) {
		const uploadFormData = new FormData();
		uploadFormData.append("file", file);

		const response = await fetch("/api/upload-menu-image", {
			method: "POST",
			body: uploadFormData,
		});

		const result = await response.json();
		if (!response.ok || !result.success) {
			throw new Error(result.message || "Gagal mengunggah gambar");
		}

		return result.url as string;
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!form.name.trim() || !form.price || (form.stockMode === "number" && !form.stock) || !form.menuCategoryId) {
			setError("Silakan isi semua field yang diperlukan");
			return;
		}

	        if (form.cost === "" || isNaN(parseFloat(form.cost)) || parseFloat(form.cost) < 0) {
	          setError("Silakan isi HPP (cost) yang valid");
	          return;
	        }

		if (parseFloat(form.price) <= 0) {
			setError("Harga harus lebih dari 0");
			return;
		}

		if (form.stockMode === "number" && parseInt(form.stock) < 0) {
			setError("Stok tidak boleh negatif");
			return;
		}

		setSubmitting(true);

		try {
			let imageUrl = form.image || undefined;
			if (imageFile) {
				imageUrl = await uploadMenuImage(imageFile);
			}

			const menuStock = form.stockMode === "ready" ? 0 : parseInt(form.stock, 10);

			if (form.id) {
				const res = await updateMenuAction(form.id, penjualId, {
					name: form.name,
					description: form.description || undefined,
					price: parseFloat(form.price),
					cost: parseFloat(form.cost || "0"),
					menuCategoryId: form.menuCategoryId,
					stock: menuStock,
					image: imageUrl,
					isAvailable: form.isAvailable,
				});
				if (res.success) {
					setSuccess("Menu berhasil diperbarui");
					const menusRes = await getSellerMenusAction(penjualId);
					if (menusRes.success) {
						setMenus((menusRes.data || []) as MenuItemWithDetails[]);
					}
					resetForm();
				} else {
					setError(res.message || "Gagal memperbarui menu");
				}
			} else {
				const res = await createMenuAction(penjualId, {
					name: form.name,
					description: form.description || undefined,
					price: parseFloat(form.price),
					cost: parseFloat(form.cost || "0"),
					menuCategoryId: form.menuCategoryId,
					stock: menuStock,
					image: imageUrl,
				});
				if (res.success) {
					setSuccess("Menu berhasil ditambahkan");
					const menusRes = await getSellerMenusAction(penjualId);
					if (menusRes.success) {
						setMenus((menusRes.data || []) as MenuItemWithDetails[]);
					}
					resetForm();
				} else {
					setError(res.message || "Gagal menambahkan menu");
				}
			}
		} catch (err) {
			console.error(err);
			setError("Terjadi kesalahan saat menyimpan menu");
		} finally {
			setSubmitting(false);
		}
	}

	function onEdit(m: MenuItemWithDetails & { cost?: number }) {
		setForm({
			id: m.id,
			name: m.name,
			description: m.description || "",
			price: String(m.price),
				    cost: String(m.cost ?? "0"),
			menuCategoryId: m.menuCategoryId || "",
			stockMode: (m.stock || 0) === 0 && m.isAvailable ? "ready" : "number",
			stock: String(m.stock || 0),
			image: m.image || "",
			isAvailable: m.isAvailable ?? true,
		});
		if (m.image) {
			setPreviewImage(m.image);
		}
		setImageFile(null);
		setError("");
		setSuccess("");
		setShowForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function onDelete(id: string) {
		if (!confirm("Yakin ingin menghapus menu ini?")) return;
		try {
			const res = await deleteMenuAction(id, penjualId);
			if (res.success) {
				setSuccess("Menu berhasil dihapus");
				const menusRes = await getSellerMenusAction(penjualId);
				if (menusRes.success) {
					setMenus((menusRes.data || []) as MenuItemWithDetails[]);
				}
			} else {
				setError(res.message || "Gagal menghapus menu");
			}
		} catch (err) {
			console.error(err);
			setError("Gagal menghapus menu");
		}
	}

	const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "-";

	return (
		<div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Kelola Menu</h1>
						<p className="text-slate-600 mt-1">Tambah, edit, atau hapus menu bisnis Anda</p>
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

				{/* Menu List Section */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-slate-900">Daftar Menu ({menus.length})</h2>
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
								Tambah Menu
							</button>
						)}
					</div>

					{menus.length === 0 ? (
						<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
							<svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							<p className="text-slate-600 text-lg">Belum ada menu yang ditambahkan</p>
							<p className="text-slate-500 text-sm mt-2">Mulai dengan menambahkan menu pertama Anda</p>
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
								Tambah Menu Pertama
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{menus.map((m) => (
								<div key={m.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
									{/* Gambar */}
									<div className="relative h-40 bg-linear-to-br from-slate-200 to-slate-300 overflow-hidden">
										{m.image ? (
											<Image src={m.image} alt={m.name} fill className="object-cover" />
										) : (
											<div className="w-full h-full flex items-center justify-center">
												<svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
												</svg>
											</div>
										)}
										<div className="absolute top-2 right-2">
											<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${m.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
												{m.isAvailable ? '✓ Tersedia' : '✗ Habis'}
											</span>
										</div>
									</div>

									{/* Content */}
									<div className="p-4">
										<h3 className="font-bold text-slate-900 text-lg mb-2">{m.name}</h3>
										{m.description && (
											<p className="text-sm text-slate-600 mb-3 line-clamp-2">{m.description}</p>
										)}
										<div className="space-y-2 mb-4 text-sm text-slate-600">
											<div className="flex justify-between">
												<span>Kategori:</span>
												<span className="font-medium text-slate-900">{getCategoryName(m.menuCategoryId || "")}</span>
											</div>
											<div className="flex justify-between">
												<span>Harga:</span>
												<span className="font-bold text-blue-600">Rp {m.price.toLocaleString('id-ID')}</span>
											</div>
											<div className="flex justify-between">
												<span>Stok:</span>
												<span className={`font-medium ${(m.stock || 0) > 5 ? 'text-green-600' : (m.stock || 0) > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
													{(m.stock || 0) === 0 && m.isAvailable ? "Ready" : `${m.stock || 0} pcs`}
												</span>
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-4 border-t border-slate-200">
											<button 
												onClick={() => onEdit(m)}
												className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition text-sm"
											>
												✎ Edit
											</button>
											<button 
												onClick={() => onDelete(m.id)}
												className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg transition text-sm"
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
							<h2 className="text-xl font-bold text-slate-900">{form.id ? "Edit Menu" : "Tambah Menu Baru"}</h2>
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
								{/* Nama Menu */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Nama Menu *</label>
									<input 
										type="text"
										value={form.name}
										onChange={(e) => setForm({...form, name: e.target.value})}
										placeholder="Contoh: Nasi Goreng Spesial"
										className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
										required
									/>
								</div>

								{/* Kategori */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Kategori *</label>
									<select 
										value={form.menuCategoryId}
										onChange={(e) => setForm({...form, menuCategoryId: e.target.value})}
										className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
										required
									>
										<option value="">Pilih Kategori</option>
										{categories.map(cat => (
											<option key={cat.id} value={cat.id}>{cat.name}</option>
										))}
									</select>
									<button
										type="button"
										onClick={() => setShowQuickCategoryForm((current) => !current)}
										className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
									>
										{showQuickCategoryForm ? "Tutup tambah kategori" : "+ Tambah kategori baru"}
									</button>
									{showQuickCategoryForm && (
										<div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
											<div>
												<label className="block text-xs font-medium text-slate-600 mb-1">Nama kategori</label>
												<input
													type="text"
													value={quickCategoryName}
													onChange={(e) => setQuickCategoryName(e.target.value)}
													placeholder="Contoh: Makanan Utama"
													className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
												/>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div>
													<label className="block text-xs font-medium text-slate-600 mb-1">Deskripsi</label>
													<input
														type="text"
														value={quickCategoryDescription}
														onChange={(e) => setQuickCategoryDescription(e.target.value)}
														placeholder="Misal: Menu favorit"
														className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
													/>
												</div>
												<div>
													<label className="block text-xs font-medium text-slate-600 mb-1">Icon</label>
													<input
														type="text"
														value={quickCategoryIcon}
														onChange={(e) => setQuickCategoryIcon(e.target.value)}
														className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
													/>
												</div>
											</div>
											<button
												type="button"
												onClick={handleQuickCategoryCreate}
												disabled={quickCategorySaving}
												className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
											>
												{quickCategorySaving ? "Menyimpan..." : "Simpan kategori"}
											</button>
										</div>
									)}
								</div>

								{/* Harga */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Harga (Rp) *</label>
									<input 
										type="number"
										value={form.price}
										onChange={(e) => setForm({...form, price: e.target.value})}
										placeholder="0"
										min="0"
										step="500"
										className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
										required
									/>
								</div>

								{/* HPP / Cost */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">HPP (Rp) *</label>
									<input
										type="number"
										value={form.cost}
										onChange={(e) => setForm({...form, cost: e.target.value})}
										placeholder="0"
										min="0"
										step="100"
										className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
										required
									/>
								</div>

								{/* Stok */}
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-2">Stok *</label>
									<div className="flex gap-2 rounded-lg border border-slate-300 p-1">
										<button
											type="button"
											onClick={() => setForm({ ...form, stockMode: "number" })}
											className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${form.stockMode === "number" ? "bg-blue-600 text-white" : "bg-transparent text-slate-700 hover:bg-slate-100"}`}
										>
											Stok angka
										</button>
										<button
											type="button"
											onClick={() => setForm({ ...form, stockMode: "ready", stock: "" })}
											className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${form.stockMode === "ready" ? "bg-blue-600 text-white" : "bg-transparent text-slate-700 hover:bg-slate-100"}`}
										>
											Stok ready
										</button>
									</div>
									{form.stockMode === "number" ? (
										<input 
											type="number"
											value={form.stock}
											onChange={(e) => setForm({...form, stock: e.target.value})}
											placeholder="0"
											min="0"
											className="mt-3 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
											required
										/>
									) : (
										<div className="mt-3 rounded-lg border border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
											Stok akan ditandai sebagai ready dan tidak perlu input angka.
										</div>
									)}
								</div>
							</div>

							{/* Deskripsi */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
								<textarea 
									value={form.description}
									onChange={(e) => setForm({...form, description: e.target.value})}
									placeholder="Jelaskan menu Anda dengan detail..."
									rows={3}
									className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
								/>
							</div>

							{/* Gambar */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">Gambar Menu</label>
								<div className="flex gap-6">
									<div className="flex-1">
										<label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
											<div className="text-center">
												<svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
												</svg>
												<p className="text-sm text-slate-600">Klik untuk upload atau drag drop</p>
												<p className="text-xs text-slate-500 mt-1">PNG, JPG, max 5MB</p>
											</div>
											<input 
												type="file"
												accept="image/*"
												onChange={handleImageChange}
												className="hidden"
											/>
										</label>
									</div>
									{previewImage && (
										<div className="relative w-32 h-32 shrink-0 rounded-lg border border-slate-300 overflow-hidden">
											<Image src={previewImage} alt="Preview" fill className="object-cover" />
										</div>
									)}
								</div>
							</div>

							{/* Status */}
							<div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
								<label className="flex items-center gap-2 cursor-pointer">
									<input 
										type="checkbox"
										checked={form.isAvailable}
										onChange={(e) => setForm({...form, isAvailable: e.target.checked})}
										className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
									/>
									<span className="text-sm font-medium text-slate-700">Menu Tersedia</span>
								</label>
							</div>

							{/* Buttons */}
							<div className="flex gap-3 pt-4">
								<button 
									type="submit"
									disabled={submitting}
									className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
								>
									{submitting && <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
									{form.id ? "Simpan Perubahan" : "Tambah Menu"}
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


