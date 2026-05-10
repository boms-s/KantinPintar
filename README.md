# 🍱 Smart Kantin - Modernizing School Canteens

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Smart Kantin** adalah platform digital ekosistem kantin sekolah/universitas yang dirancang untuk mempercepat proses pemesanan, meningkatkan transparansi keuangan, dan menghilangkan antrean panjang. Dengan desain **Bento Box UI/UX** yang modern dan performa tinggi berbasis **Next.js 16**, Smart Kantin memberikan pengalaman "Smart Catering" yang sesungguhnya.

---

## ✨ Fitur Utama

### 🛒 Untuk Pembeli
- **Bento Box Dashboard**: Tampilan menu yang terorganisir dan visual yang menarik.
- **Pemesanan Cepat**: Pesan makanan dari mana saja tanpa harus mengantre.
- **Digital Payment**: Integrasi pembayaran non-tunai (Midtrans).
- **Status Real-time**: Notifikasi saat pesanan sedang diproses hingga siap diambil.

### 🏪 Untuk Penjual
- **Kelola Menu**: Manajemen stok, harga, dan kategori menu secara instan.
- **Laporan Penjualan**: Dashboard analitik untuk melihat pendapatan harian dan bulanan.
- **Manajemen Antrean**: Sistem otomatisasi pesanan masuk untuk efisiensi dapur.
- **Export Data**: Cetak laporan penjualan ke format PDF atau Excel.

### 🛡️ Keamanan & Performa
- **Auth Shell**: Sistem login/register dengan *Glassmorphism* UI dan validasi tingkat tinggi.
- **Atomic Design**: Komponen UI yang modular, scalable, dan konsisten.
- **Dark Mode Support**: Kenyamanan visual di segala kondisi pencahayaan.

---

## 🏗️ Arsitektur & Logika Sistem

Sistem Smart Kantin dibangun dengan pendekatan modern yang memisahkan antara *UI Presentation Layer*, *Business Logic Layer*, dan *Data Access Layer*.

### 1. Atomic Design Pattern
Kami menerapkan **Atomic Design** untuk mengelola komponen UI agar tetap scalable:
- **Atoms**: Komponen dasar seperti `Button`, `Input`, `Badge`.
- **Molecules**: Kombinasi atom seperti `FormField`, `MenuCard`.
- **Organisms**: Komponen kompleks seperti `Navbar`, `MenuGrid`, `Sidebar`.

### 2. Server-Side Excellence (Next.js 16)
- **Server Actions**: Menggunakan fitur terbaru Next.js untuk operasi mutasi data (Login, Order, Menu) secara type-safe langsung dari sisi server.
- **Server Components**: Memaksimalkan rendering di sisi server untuk mempercepat *First Contentful Paint* (FCP) dan SEO.

### 3. State Management & Real-time Logic
- **React Context**: Digunakan untuk mengelola state global seperti `AuthContext` (Autentikasi), `CartContext` (Keranjang Belanja), dan `PembeliContext`.
- **Order Synchronization**: Mekanisme sinkronisasi status pesanan antara pembeli dan penjual yang efisien untuk memastikan data tetap akurat.

### 4. Integrasi Pembayaran (Midtrans API)
Sistem terintegrasi dengan **Midtrans Snapshot API** yang memungkinkan:
- Pembuatan kode pembayaran unik secara otomatis.
- Verifikasi status pembayaran (Success, Pending, Expired) secara otomatis.
- Keamanan transaksi tingkat tinggi sesuai standar industri.

---

## 🛠️ Tech Stack Detail

| Technology | Usage | Benefit |
|------------|-------|---------|
| **Next.js 16** | Core Framework | App Router & Server Actions untuk performa maksimal. |
| **Prisma ORM** | Database Layer | Type-safe queries dan manajemen skema database yang mudah. |
| **Tailwind CSS 4** | Styling | Utility-first CSS untuk UI yang sangat cepat dan responsif. |
| **Framer Motion** | Animations | Animasi mikro dan transisi halaman yang *smooth* dan premium. |
| **Zod** | Data Validation | Memastikan data yang masuk ke server selalu valid dan aman. |
| **Bcrypt.js** | Security | Enkripsi tingkat tinggi untuk melindungi keamanan akun pengguna. |
| **XLSX & jsPDF** | Reporting | Fitur ekspor laporan keuangan instan dalam format Excel & PDF. |

---

## 📁 Struktur Proyek

```bash
KantinPintar/
├── app/                  # Next.js App Router (Pages & API)
├── components/           # UI Components (Atomic Design: atoms, molecules, organisms)
├── lib/                  # Utilities, Context Providers, & Database Layer
├── prisma/               # Database Schema & Migrations
├── public/               # Static Assets (Images, Icons, etc.)
├── ARCHITECTURE.md       # Dokumentasi Teknis Sistem
├── DATABASE.md           # Dokumentasi Skema Database
└── README.md             # Dokumentasi Utama
```

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- Node.js v20+ 
- MySQL atau PostgreSQL Database

### Instalasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/arifsuz/KantinPintar.git
   cd KantinPintar
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` ke `.env.local` dan isi kredensial database Anda.
   ```env
   DATABASE_URL="mysql://user:pass@localhost:3306/kantinpintar"
   MIDTRANS_SERVER_KEY="your_key"
   ```

4. **Setup Database**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Jalankan aplikasi**:
   ```bash
   npm run dev
   ```

---

## 👥 Tim Pengembang

Proyek ini dikembangkan dengan ❤️ oleh:

- **Muhamad Nur Arif** - *Lead Developer & Fullstack* ([GitHub](https://github.com/arifsuz))
- **Muhamad Riski Purwanto** - *UI/UX Designer & Frontend* ([GitHub](https://github.com/boms-s))

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detailnya.
