# 📚 Developer Reference - Kantin Pintar API

## Overview

Kantin Pintar menggunakan **localStorage** untuk data persistence. Berikut adalah referensi lengkap untuk semua data structures dan operations.

---

## 🗄️ Data Structures

### 1. User (Pelanggan)

**Storage Key:** `users` (array), `currentUser` (object)

```typescript
interface User {
  email: string;
  password: string;
  fullName: string;
}

// Stored in localStorage.users as array
localStorage.users = [
  { email: "user1@email.com", password: "pass123", fullName: "John Doe" }
]

// Current logged-in user
localStorage.currentUser = {
  email: "user1@email.com",
  fullName: "John Doe"
}
```

### 2. Seller

**Storage Key:** `currentSeller`

```typescript
interface Seller {
  email: string;
  fullName: string;
  role: "seller";
}

// Stored when seller logs in
localStorage.currentSeller = {
  email: "penjual@kantinpintar.com",
  fullName: "Penjual Kantin",
  role: "seller"
}
```

### 3. Menu Item

**Storage Key:** `menuItems` (array)

```typescript
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

localStorage.menuItems = [
  {
    id: "nasi-ayam-1",
    name: "Nasi Ayam Geprek",
    category: "Mains",
    price: 18000,
    description: "Nasi putih dengan ayam geprek pedas",
    image: "url-to-image"
  }
]
```

### 4. Order

**Storage Key:** `orders` (array)

```typescript
interface OrderItem {
  id: string;                          // timestamp-based unique id
  menuId: string;                      // reference to menu item
  userEmail?: string;                  // email of ordering user
  userFullName?: string;               // name of ordering user
  name: string;                        // food name (snapshot)
  price: number;                       // price at order time (snapshot)
  quantity: number;                    // ordered quantity
  orderedAt: string;                   // ISO timestamp
  status: "dipesan" | "diproses" | "siap_diambil" | "diambil";
}

localStorage.orders = [
  {
    id: "1705315200000",
    menuId: "nasi-ayam-1",
    userEmail: "user1@email.com",
    userFullName: "John Doe",
    name: "Nasi Ayam Geprek",
    price: 18000,
    quantity: 1,
    orderedAt: "2024-01-15T10:30:00Z",
    status: "siap_diambil"
  }
]
```

**Status Flow:**
```
dipesan → diproses → siap_diambil → diambil
  ↓          ↓            ↓
 New     Processing    Ready       Completed
```

### 5. Notification

**Storage Key:** `notifications` (array)

```typescript
interface NotificationItem {
  id: string;              // timestamp-based unique id
  to?: string;             // email of recipient
  message: string;         // notification message
  read?: boolean;          // read status
  createdAt: string;       // ISO timestamp
}

localStorage.notifications = [
  {
    id: "1705315202000",
    to: "user1@email.com",
    message: "Pesanan Anda \"Nasi Ayam Geprek\" sudah siap diambil.",
    read: false,
    createdAt: "2024-01-15T10:32:00Z"
  }
]
```

---

## 🔄 Operations

### User Authentication

#### Register User
```typescript
// Location: app/register/page.tsx
function registerUser(email: string, password: string, fullName: string) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const newUser = { email, password, fullName };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
}
```

#### Login User
```typescript
// Location: app/login/page.tsx
function loginUser(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify({
      email: user.email,
      fullName: user.fullName
    }));
    return true;
  }
  return false;
}
```

#### Logout
```typescript
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentSeller");
  localStorage.removeItem("currentAdmin");
}
```

---

### Menu Operations

#### Get Menu Items
```typescript
// Location: Multiple dashboard pages
function getMenuItems(): MenuItem[] {
  const menu = localStorage.getItem("menuItems");
  return menu ? JSON.parse(menu) : [];
}
```

#### Initialize Sample Menu (First Time)
```typescript
function initializeSampleMenu() {
  const sampleMenu: MenuItem[] = [
    {
      id: "nasi-ayam-1",
      name: "Nasi Ayam Geprek",
      category: "Mains",
      price: 18000,
      description: "Nasi putih dengan ayam geprek pedas"
    },
    // ... more items
  ];
  localStorage.setItem("menuItems", JSON.stringify(sampleMenu));
}
```

---

### Order Operations

#### Create Order
```typescript
// Location: app/dashboard/menu/page.tsx
function createOrder(menuItem: MenuItem, currentUser: User) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  
  const newOrder: OrderItem = {
    id: Date.now().toString(),
    menuId: menuItem.id,
    userEmail: currentUser.email,
    userFullName: currentUser.fullName,
    name: menuItem.name,
    price: menuItem.price,
    quantity: 1,
    orderedAt: new Date().toISOString(),
    status: "dipesan"
  };
  
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  
  return newOrder;
}
```

#### Get User's Active Orders
```typescript
// Location: app/dashboard/pesanan/page.tsx
function getUserActiveOrders(userEmail: string): OrderItem[] {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders.filter(o => 
    o.userEmail === userEmail && 
    o.status !== "diambil"
  );
}
```

#### Get User's Order History
```typescript
// Location: app/dashboard/riwayat/page.tsx
function getUserOrderHistory(userEmail: string): OrderItem[] {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders.filter(o => 
    o.userEmail === userEmail && 
    o.status === "diambil"
  );
}
```

#### Update Order Status
```typescript
// Location: app/seller/dashboard/page.tsx
function updateOrderStatus(orderId: string, newStatus: OrderItem["status"]) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const updated = orders.map(o =>
    o.id === orderId ? { ...o, status: newStatus } : o
  );
  localStorage.setItem("orders", JSON.stringify(updated));
  
  return updated.find(o => o.id === orderId);
}
```

#### Mark Order as Picked Up
```typescript
// Location: app/dashboard/pesanan/page.tsx
function completeOrder(orderId: string) {
  return updateOrderStatus(orderId, "diambil");
}
```

---

### Notification Operations

#### Create Notification (When Seller Marks Ready)
```typescript
// Location: app/seller/dashboard/page.tsx
function createNotification(userEmail: string, orderName: string) {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  
  const newNotification: NotificationItem = {
    id: Date.now().toString(),
    to: userEmail,
    message: `Pesanan Anda "${orderName}" sudah siap diambil.`,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.push(newNotification);
  localStorage.setItem("notifications", JSON.stringify(notifications));
  
  return newNotification;
}
```

#### Get User Notifications
```typescript
// Location: app/dashboard/page.tsx
function getUserNotifications(userEmail: string): NotificationItem[] {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  return notifications.filter(n => n.to === userEmail);
}
```

#### Mark Notification as Read
```typescript
function markNotificationAsRead(notificationId: string) {
  const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
  const updated = notifications.map(n =>
    n.id === notificationId ? { ...n, read: true } : n
  );
  localStorage.setItem("notifications", JSON.stringify(updated));
}
```

---

## 🔐 Authentication

### Hardcoded Credentials

**Admin:**
```typescript
// Location: lib/adminCredentials.ts
const ADMIN_CREDENTIALS = {
  email: "admin@kantinpintar.com",
  password: "admin123",
  fullName: "Admin Kantin"
};
```

**Seller:**
```typescript
// Location: lib/sellerCredentials.ts
const SELLER_CREDENTIALS = {
  email: "penjual@kantinpintar.com",
  password: "penjual123",
  fullName: "Penjual Kantin"
};
```

---

## 🎯 Common Use Cases

### UC1: Customer Orders Food
```typescript
// 1. User navigates to /dashboard/menu
// 2. Component calls getMenuItems()
// 3. User clicks "Pesan" on food item
// 4. Call createOrder(menuItem, currentUser)
// 5. Display success message
```

### UC2: Seller Processes Order
```typescript
// 1. Seller navigates to /seller/dashboard
// 2. Component loads all orders from localStorage.orders
// 3. Seller clicks "Proses" 
// 4. Call updateOrderStatus(orderId, "diproses")
// 5. Seller clicks "Siap Diambil"
// 6. Call updateOrderStatus(orderId, "siap_diambil")
// 7. Call createNotification(userEmail, orderName)
// 8. Notification stored, customer will see it
```

### UC3: Customer Receives Notification
```typescript
// 1. Customer on /dashboard
// 2. Component on mount calls getUserNotifications(currentUser.email)
// 3. Display notification bell with count
// 4. Customer clicks bell
// 5. Display notification panel with messages
```

### UC4: Customer Confirms Pickup
```typescript
// 1. Customer on /dashboard/pesanan
// 2. Component filters orders by status !== "diambil"
// 3. When status === "siap_diambil", show "Konfirmasi Ambil" button
// 4. Customer clicks button
// 5. Call completeOrder(orderId) / updateOrderStatus(orderId, "diambil")
// 6. Order disappears from active orders
// 7. Appears in /dashboard/riwayat
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Customer  │
└──────┬──────┘
       │ Register/Login
       ▼
┌──────────────────────┐
│  localStorage.users  │
│  localStorage.current │
│      User            │
└──────┬───────────────┘
       │ Browse Menu
       ▼
┌──────────────────────┐
│ localStorage.        │
│   menuItems          │
└──────┬───────────────┘
       │ Order Food
       ▼
┌──────────────────────┐
│ localStorage.orders  │
│ {status: "dipesan"}  │
└──────┬───────────────┘
       │
       │ (Seller sees order)
       │
    ┌──┴──────────────────────┐
    │   Seller Dashboard       │
    │ /seller/dashboard        │
    └──┬─────────────────────┬─┘
       │ Process              │ Notify
       │ (Mark Ready)         │
       ▼                      ▼
   Update Status         Create Notification
   siap_diambil          → localStorage.
                             notifications
       │                     │
       └──────────┬──────────┘
                  │
                  ▼ (Customer refreshes)
          Customer gets notification
                  │
                  ▼
          Confirm Pickup
                  │
                  ▼
          Update Status: diambil
                  │
                  ▼
          Move to Order History
```

---

## 🚀 Integration Points

### For Backend/API Integration:

Replace localStorage operations with API calls:

```typescript
// Before: localStorage
const orders = JSON.parse(localStorage.getItem("orders") || "[]");

// After: API
const { data: orders } = await fetch("/api/orders").then(r => r.json());
```

**Recommended API Endpoints:**
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/menu` — Get menu items
- `POST /api/orders` — Create order
- `GET /api/orders` — Get user's orders
- `PATCH /api/orders/:id` — Update order status
- `GET /api/notifications` — Get notifications
- `POST /api/notifications` — Create notification

---

## 🧪 Testing Helpers

```typescript
// Clear all data
function clearAllData() {
  const keys = ['users', 'currentUser', 'orders', 'menuItems', 
                'notifications', 'currentSeller', 'currentAdmin'];
  keys.forEach(k => localStorage.removeItem(k));
}

// Initialize test data
function initializeTestData() {
  const testUser = { email: "test@test.com", password: "test123", fullName: "Test User" };
  localStorage.setItem("users", JSON.stringify([testUser]));
  
  const testMenu = [
    { id: "1", name: "Test Food", category: "Test", price: 10000, description: "Test" }
  ];
  localStorage.setItem("menuItems", JSON.stringify(testMenu));
}

// View all data
function viewAllData() {
  console.log({
    users: JSON.parse(localStorage.getItem("users") || "[]"),
    currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
    orders: JSON.parse(localStorage.getItem("orders") || "[]"),
    notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
    menuItems: JSON.parse(localStorage.getItem("menuItems") || "[]")
  });
}
```

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial release with login, orders, notifications |

---

**For Questions:** Refer to [SELLER_GUIDE.md](SELLER_GUIDE.md) or [QUICKSTART.md](QUICKSTART.md)
