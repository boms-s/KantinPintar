# Panduan Sistem Login & Dashboard Penjual

## 🎯 Ringkasan Fitur

Aplikasi Kantin Pintar memiliki 3 tipe pengguna dengan akses berbeda:
- **Pelanggan** — Memesan makanan, melihat pesanan, menerima notifikasi
- **Penjual** — Mengelola pesanan, mengubah status, mengirim notifikasi ke pelanggan
- **Admin** — Manajemen sistem (opsional)

---

## 🔐 Kredensial Login

### Pelanggan (User)
- Buat akun di halaman Registrasi atau gunakan data yang ada di `localStorage`
- Contoh akun: Buat melalui halaman register

### Penjual
- **Email:** `penjual@kantinpintar.com`
- **Password:** `penjual123`
- **Role:** Seller

### Admin
- **Email:** `admin@kantinpintar.com`
- **Password:** `admin123`
- **Role:** Admin

---

## 📱 Alur Login

### 1. Halaman Login (`/login`)
- Tampilkan 3 tab: **🛒 Pelanggan** | **👨‍🍳 Penjual** | **🔐 Admin**
- Pilih tab sesuai peran pengguna
- Masukkan email dan password
- Klik tombol login

### 2. Redirect Setelah Login
| Role | Redirect |
|------|----------|
| Pelanggan | `/dashboard` |
| Penjual | `/seller/dashboard` |
| Admin | `/admin/dashboard` |

---

## 👨‍🍳 Dashboard Penjual (`/seller/dashboard`)

### Layout
```
┌─ Sidebar ─────────────────────┬─ Main Content ──────────────┐
│ • PENJUAL KANTIN              │ Pesanan Masuk               │
│ • Navigation Links            │ ─────────────────────────── │
│ • Quick Stats                 │                             │
│   - Pending: X                │ [Order Card 1]              │
│   - Diproses: X               │ [Order Card 2]              │
│   - Siap: X                   │ [Order Card 3]              │
│   - Selesai: X                │                             │
│                               │                             │
│ [Logout]                      │ ...                         │
└───────────────────────────────┴─────────────────────────────┘
```

### Fitur Penjual

#### A. Melihat Pesanan Masuk
- Pesanan ditampilkan dalam list dengan informasi:
  - **Nama Pelanggan** & Email
  - **Nama Makanan** & Harga
  - **Waktu Pemesanan**
  - **Status Saat Ini**
  - **Tombol Aksi**

#### B. Mengubah Status Pesanan
Tombol aksi tersedia sesuai status:

| Status | Tombol | Hasil |
|--------|--------|-------|
| 🔵 dipesan | "Proses" | Status → diproses |
| 🟠 diproses | "Siap Diambil" | Status → siap_diambil |
| 🟢 siap_diambil | "Selesai" | Status → diambil |
| ⚫ diambil | — | Tidak ada tombol |

#### C. Mengirim Notifikasi
**Saat status diubah menjadi "Siap Diambil":**
- Sistem otomatis membuat notifikasi
- Notifikasi dikirim ke email pelanggan (disimpan di `localStorage.notifications`)
- Isi notifikasi: `"Pesanan Anda \"[NAMA MAKANAN]\" sudah siap diambil."`
- Pelanggan akan melihat notifikasi badge di dashboard mereka

#### D. Ringkasan Statistik
Sidebar menampilkan:
- **Pending** — Jumlah pesanan baru (status: dipesan)
- **Diproses** — Jumlah pesanan yang sedang diproses
- **Siap** — Jumlah pesanan siap diambil
- **Selesai** — Jumlah pesanan selesai (diambil)

---

## 🛒 Dashboard Pelanggan (`/dashboard`)

### Navigasi Utama
- **Menu Makanan** — Lihat dan pesan makanan
- **Pesanan Saya** — Lihat pesanan aktif (belum diambil)
- **Riwayat Pesanan** — Lihat pesanan selesai
- **Keranjang** — (Untuk pengembangan)
- **Profil** — (Untuk pengembangan)
- **Bantuan** — (Untuk pengembangan)

### Fitur

#### 1. Menu Makanan (`/dashboard/menu`)
- Tampilkan daftar makanan dari `localStorage.menuItems`
- Tombol "Pesan" untuk menambahkan ke pesanan
- Pesanan baru memiliki:
  - `userEmail` — Email pelanggan
  - `userFullName` — Nama pelanggan
  - Status awal: `"dipesan"`

#### 2. Pesanan Saya (`/dashboard/pesanan`)
- Tampilkan pesanan aktif (status ≠ "diambil") milik pelanggan yang login
- Informasi per pesanan:
  - Nama makanan & harga
  - Status pesanan
  - Waktu pemesanan
- **Tombol Aksi:**
  - Hanya tampil saat status = `"siap_diambil"`
  - Label: "Konfirmasi Ambil"
  - Klik untuk menandai pesanan sebagai `"diambil"`

#### 3. Riwayat Pesanan (`/dashboard/riwayat`)
- Tampilkan pesanan selesai (status = "diambil") milik pelanggan yang login
- Untuk referensi dan audit

#### 4. Notifikasi
- Badge notifikasi (🔔) di header dashboard
- Klik untuk membuka panel notifikasi
- Notifikasi dikirim ketika penjual menandai pesanan `"siap_diambil"`

---

## 💾 Struktur Data localStorage

### Pengguna
```json
{
  "users": [
    { "email": "user1@email.com", "password": "pass123", "fullName": "User One" }
  ],
  "currentUser": { "email": "user1@email.com", "fullName": "User One" }
}
```

### Penjual
```json
{
  "currentSeller": { "email": "penjual@kantinpintar.com", "fullName": "Penjual Kantin", "role": "seller" }
}
```

### Pesanan
```json
{
  "orders": [
    {
      "id": "1234567890",
      "menuId": "nasi-ayam",
      "userEmail": "user1@email.com",
      "userFullName": "User One",
      "name": "Nasi Ayam Geprek",
      "price": 18000,
      "quantity": 1,
      "orderedAt": "2024-01-15T10:30:00Z",
      "status": "siap_diambil"
    }
  ]
}
```

### Notifikasi
```json
{
  "notifications": [
    {
      "id": "1234567891",
      "to": "user1@email.com",
      "message": "Pesanan Anda \"Nasi Ayam Geprek\" sudah siap diambil.",
      "read": false,
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

## 🧪 Skenario Testing

### Test Case 1: Alur Lengkap Pemesanan
1. **Login Pelanggan**
   - Buka `/login`
   - Pilih tab "Pelanggan"
   - Masukkan kredensial user
   - ✅ Redirect ke `/dashboard`

2. **Pesan Makanan**
   - Klik "Menu Makanan"
   - Klik tombol "Pesan" pada makanan
   - ✅ Notifikasi: "Makanan berhasil ditambahkan"
   - ✅ Pesanan muncul di `localStorage.orders` dengan `userEmail`

3. **Lihat Pesanan Aktif**
   - Klik "Pesanan Saya"
   - ✅ Pesanan baru tampil dengan status "Pesanan Diterima"
   - ✅ Tidak ada tombol aksi (status bukan "siap_diambil")

4. **Penjual Proses Pesanan**
   - Login Penjual (`/login` → tab "Penjual")
   - Email: `penjual@kantinpintar.com` / Password: `penjual123`
   - ✅ Redirect ke `/seller/dashboard`
   - ✅ Pesanan user muncul di list
   - Klik "Proses" → status menjadi "diproses"
   - Klik "Siap Diambil" → status menjadi "siap_diambil"
   - ✅ Notifikasi dibuat di `localStorage.notifications`

5. **Pelanggan Terima Notifikasi**
   - Klik icon notifikasi (🔔) di dashboard pelanggan
   - ✅ Badge menampilkan jumlah notifikasi
   - ✅ Panel notifikasi menampilkan pesan: "Pesanan Anda \"Nasi Ayam Geprek\" sudah siap diambil."

6. **Pelanggan Konfirmasi Pengambilan**
   - Klik "Pesanan Saya"
   - ✅ Tombol "Konfirmasi Ambil" sekarang terlihat
   - Klik tombol
   - ✅ Status pesanan berubah menjadi "diambil"
   - ✅ Pesanan hilang dari "Pesanan Saya", muncul di "Riwayat Pesanan"

---

## 📁 File Penting

| File | Fungsi |
|------|--------|
| `app/login/page.tsx` | Halaman login unified untuk user/seller/admin |
| `lib/sellerCredentials.ts` | Kredensial penjual |
| `app/dashboard/menu/page.tsx` | Halaman menu & pemesanan |
| `app/dashboard/pesanan/page.tsx` | Halaman pesanan aktif |
| `app/dashboard/riwayat/page.tsx` | Halaman riwayat pesanan |
| `app/seller/dashboard/page.tsx` | Dashboard penjual |

---

## ⚠️ Catatan Penting

1. **Penyimpanan Data Lokal** — Data disimpan di `localStorage`, tidak persisten setelah browser ditutup sepenuhnya
2. **Keamanan** — Ini adalah prototype; kredensial disimpan di kode (hardcoded)
3. **Multi-User** — Setiap user hanya melihat pesanan mereka sendiri (filter berdasarkan `userEmail`)
4. **Notifikasi Real-time** — Notifikasi disimpan di `localStorage`; untuk real-time production gunakan WebSocket/Server Push

---

## 🔧 Pengembangan Lanjutan

Fitur yang dapat ditambahkan:
- [ ] Backend API untuk persistensi database
- [ ] Autentikasi aman (JWT tokens)
- [ ] Real-time notifications (WebSocket)
- [ ] Menu management untuk admin
- [ ] User profile & edit password
- [ ] Review & rating sistem
- [ ] Chat customer support

---

**Dibuat untuk:** Smart Kantin Project  
**Terakhir diupdate:** 2024
