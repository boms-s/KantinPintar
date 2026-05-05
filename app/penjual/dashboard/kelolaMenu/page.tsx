"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/lib/types";
import { menuStorage, penjualSession } from "@/lib/storage";

export default function KelolaMenuPage() {
	const router = useRouter();
	const seller = penjualSession.get();
	const [menus, setMenus] = useState<MenuItem[]>(() => menuStorage.getAll());

	const [form, setForm] = useState({ id: "", name: "", price: "", available: true });

	// initial state provided via lazy initializers above; no effect required

	if (!seller) {
		return (
			<div className="p-6">
				<p className="text-red-500">Anda belum login sebagai penjual. Silakan <a className="text-blue-600" href="/penjual/login">login</a>.</p>
			</div>
		);
	}

	function resetForm() {
		setForm({ id: "", name: "", price: "", available: true });
	}

	function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.name || !form.price) return;

		if (!seller) return;

		if (form.id) {
			// edit
			const all = menuStorage.getAll();
			const idx = all.findIndex((m) => m.id === form.id);
			if (idx !== -1) {
				all[idx] = { ...all[idx], name: form.name, price: Number(form.price), available: form.available } as MenuItem;
				menuStorage.set(all);
				setMenus(menuStorage.getAll());					menuStorage.notifyUpdate();				resetForm();
			}
		} else {
			// add
			const newItem: MenuItem = {
				id: crypto.randomUUID(),
				name: form.name,
				price: Number(form.price),
				penjualId: seller.id,
				penjualName: seller.fullName || (seller as { name?: string }).name || "",
				available: form.available,
			} as MenuItem;

			menuStorage.add(newItem);
			setMenus(menuStorage.getAll());
			menuStorage.notifyUpdate();
			resetForm();
		}
	}

	function onEdit(m: MenuItem) {
		setForm({ id: m.id, name: m.name, price: String(m.price), available: !!m.available });
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function onDelete(id: string) {
		if (!confirm("Hapus menu ini?")) return;
		const remaining = menuStorage.getAll().filter((m) => m.id !== id);
		menuStorage.set(remaining);
		menuStorage.notifyUpdate();
		setMenus(menuStorage.getAll());
	}

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Kelola Menu</h1>
				<button onClick={() => router.push('/penjual/dashboard')} className="text-sm text-blue-600">Kembali ke Dashboard</button>
			</div>

			<form onSubmit={onSubmit} className="bg-white p-4 rounded shadow mb-6">
				<div className="flex flex-col md:flex-row gap-2">
					<input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Nama menu" className="border px-3 py-2 flex-1" />
					<input value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} placeholder="Harga" type="number" className="border px-3 py-2 w-40" />
					<label className="flex items-center gap-2">
						<input type="checkbox" checked={form.available} onChange={(e)=>setForm({...form, available: e.target.checked})} /> Tersedia
					</label>
					<div className="flex gap-2">
						<button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{form.id ? 'Simpan' : 'Tambah'}</button>
						<button type="button" onClick={resetForm} className="px-4 py-2 rounded border">Batal</button>
					</div>
				</div>
			</form>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{menus.filter(m=>m.penjualId===seller.id).map((m)=> (
					<div key={m.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
						<div>
							<p className="font-semibold">{m.name}</p>
							<p className="text-sm text-gray-500">Rp {m.price.toLocaleString('id-ID')} • {m.available ? 'Tersedia' : 'Habis'}</p>
						</div>
						<div className="flex gap-2">
							<button onClick={()=>onEdit(m)} className="px-3 py-1 rounded border">Edit</button>
							<button onClick={()=>onDelete(m.id)} className="px-3 py-1 rounded text-red-600 border">Hapus</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

