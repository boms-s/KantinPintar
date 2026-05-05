# 🚀 Quick Start Guide - Kantin Pintar

## 1️⃣ Setup & Run

```bash
# Navigate to project
cd "c:\Users\riski\OneDrive\Documents\Perancangan UI UX\kantinpintar"

# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

---

## 2️⃣ Login Credentials

### 👨‍💼 Customer / Pelanggan
- **Cara:** Buat akun di halaman Register
- atau gunakan akun yang sudah ada

### 👨‍🍳 Seller / Penjual
- **Email:** `penjual@kantinpintar.com`
- **Password:** `penjual123`
- **Route:** `/login` → Tab "Penjual" → `/seller/dashboard`

### 🔐 Admin
- **Email:** `admin@kantinpintar.com`
- **Password:** `admin123`
- **Route:** `/login` → Tab "Admin" → `/admin/dashboard`

---

## 3️⃣ Full Test Flow (5 mins)

### Step 1: Register Pelanggan
```
1. Go to: http://localhost:3000/register
2. Fill form:
   - Full Name: "John Doe"
   - Email: "john@test.com"
   - Password: "test123"
3. Click Register
4. Redirected to Login
```

### Step 2: Login Pelanggan
```
1. Tab: "Pelanggan"
2. Email: john@test.com
3. Password: test123
4. Click "Login"
5. ✅ Redirect to /dashboard
```

### Step 3: Order Food
```
1. Sidebar → "Menu Makanan"
2. Click "Pesan" button on any food item
3. ✅ Success message appears
```

### Step 4: View Active Orders
```
1. Sidebar → "Pesanan Saya"
2. ✅ See order with status "Pesanan Diterima"
3. ✅ NO action button (waiting for seller to process)
```

### Step 5: Seller Login
```
1. New Browser Tab: http://localhost:3000/login
2. Tab: "Penjual"
3. Email: penjual@kantinpintar.com
4. Password: penjual123
5. ✅ Redirect to /seller/dashboard
```

### Step 6: Seller Process Order
```
1. See customer order in dashboard
2. Click "Proses" → status changes to "Diproses"
3. Click "Siap Diambil" → status changes to "Siap Diambil"
4. ✅ Notification created in localStorage
```

### Step 7: Customer Gets Notification
```
1. Switch back to customer browser tab
2. Refresh page (or navigate)
3. Dashboard → Click 🔔 (bell icon)
4. ✅ See notification: "Pesanan Anda... sudah siap diambil"
```

### Step 8: Customer Confirms Pickup
```
1. Sidebar → "Pesanan Saya"
2. ✅ Now "Konfirmasi Ambil" button is visible
3. Click button
4. ✅ Status changes to "Diambil"
5. Order moves to "Riwayat Pesanan"
```

---

## 🔍 File Locations

| Purpose | File |
|---------|------|
| Main Login | `app/login/page.tsx` |
| Dashboard | `app/dashboard/page.tsx` |
| Menu | `app/dashboard/menu/page.tsx` |
| Orders | `app/dashboard/pesanan/page.tsx` |
| History | `app/dashboard/riwayat/page.tsx` |
| Seller Dashboard | `app/seller/dashboard/page.tsx` |

---

## 📱 Key Features

### ✅ Customer
- Order food from menu
- View active orders
- Get notifications from seller
- Confirm pickup
- View order history

### ✅ Seller
- See all orders from customers
- Change order status (Proses → Siap Diambil)
- Send notifications automatically
- View order statistics

---

## 🐛 Troubleshooting

### Issue: Build Error
```bash
# Clean and rebuild
rm -r .next
npm run build
```

### Issue: Data Not Persisting
```
localStorage is browser-specific. Data clears when:
- Browser cache is cleared
- Session expires
- Incognito/Private mode is used
```

### Issue: Notifications Not Showing
```
1. Refresh customer dashboard after seller marks "Siap Diambil"
2. Check browser console for errors
3. Verify order has userEmail field in localStorage.orders
```

---

## 📊 Test Data Structure

Orders are stored in `localStorage.orders`:
```json
{
  "id": "timestamp",
  "menuId": "food-id",
  "userEmail": "customer@email.com",
  "userFullName": "Customer Name",
  "name": "Food Name",
  "price": 18000,
  "quantity": 1,
  "orderedAt": "ISO-date",
  "status": "dipesan|diproses|siap_diambil|diambil"
}
```

---

## 🎯 Expected Results

| Step | Expected | Status |
|------|----------|--------|
| Register & Login | Redirect to /dashboard | ✅ |
| Order Food | Success message + order created | ✅ |
| View Orders | Order list with status | ✅ |
| Seller Process | Status updates in real-time | ✅ |
| Notification | Appears after "Siap Diambil" | ✅ |
| Confirm Pickup | Order moves to history | ✅ |

---

## 📝 Notes

- **Duration:** ~5 minutes for full flow test
- **Browsers:** Recommended to test in 2 separate browser tabs or windows
- **Data:** All data stored in browser localStorage (not persistent after browser close)
- **Build Status:** ✅ All builds passing

---

## 🔗 Documentation

- **Full Guide:** See [SELLER_GUIDE.md](SELLER_GUIDE.md)
- **Completion Summary:** See [COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)
- **Project README:** See [README.md](README.md)

---

**Ready to test?** Start with `npm run dev` and follow the steps above! 🚀
