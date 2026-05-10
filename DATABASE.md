# Database & ORM Implementation Guide

## 📊 Overview

Tahap ini adalah migrasi dari **localStorage prototype** ke **production-ready database** dengan Prisma ORM. Sistem ini menggunakan **MySQL** sebagai database engine dengan architecture yang scalable untuk platform e-commerce kantin.

## 🗂️ Database Schema

### Core Tables

#### 1. **Users & Authentication**
```
User (id, username, email, password_hash, role, createdAt, updatedAt)
  ├── Pembeli (buyer profile: fullName, phone, address, totalSpent, etc)
  ├── Penjual (seller profile: businessName, description, city, isVerified, etc)
  └── Admin (permissions, department)
```

#### 2. **Menu Management**
```
Category (id, name, description, icon)
  └── Menu (id, name, price, stock, penjualId, categoryId, averageRating, etc)
```

#### 3. **Transactions & Orders**
```
Order (id, transactionCode, pembeliId, penjualId, status, totalPrice, paymentMethod, etc)
  └── OrderItem (id, orderId, menuId, quantity, unitPrice, subtotal)
```

#### 4. **Shopping & Cart**
```
CartItem (id, pembeliId, menuId, quantity, price)
```

#### 5. **Additional Features**
```
Payment (id, orderId, method, status, proofUrl, paidAt)
Review (id, orderId, menuId, rating, comment, createdAt)
Address (id, pembeliId, label, address, city, isDefault)
FavoriteMenu (id, pembeliId, menuId)
Promotion (id, penjualId, discountType, discountValue, startDate, endDate)
```

## 🔌 Database Connection

### Configuration Files

**`.env.local`**
```env
DATABASE_URL="mysql://root:@localhost:3306/kantinpintar"
```

**`prisma.config.ts`**
```typescript
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
};
```

**`lib/prisma.ts`**
- Production-ready Prisma Client singleton
- Global instance management untuk avoid connection leaks
- Development logging untuk queries

## 📝 Database Operations Layer

Located in `lib/db/`:

### 1. **userDb** (`lib/db/users.ts`)
```typescript
- registerPembeli()      // Register buyer
- registerPenjual()      // Register seller
- login()                // Authenticate user
- getUserById()          // Get user profile
- updatePembeliProfile() // Update buyer info
- updatePenjualProfile() // Update seller info
```

### 2. **menuDb** (`lib/db/menus.ts`)
```typescript
- create()             // Create menu (seller only)
- getSellerMenus()     // Get seller's menus
- getAllMenus()        // Get all menus with filters
- getMenuById()        // Get menu details
- update()             // Update menu (seller only)
- delete()             // Delete menu (seller only)
- updateStock()        // Decrease stock on order
- getCategories()      // Get all categories
```

### 3. **cartDb** (`lib/db/cart.ts`)
```typescript
- addItem()            // Add to cart (upsert if exists)
- updateQuantity()     // Update item quantity
- removeItem()         // Remove from cart
- getCart()            // Get all cart items with totals
- clearCart()          // Clear entire cart
- getCartByPenjual()   // Get cart grouped by seller
```

### 4. **orderDb** (`lib/db/orders.ts`)
```typescript
- createOrder()        // Create new order
- getOrder()           // Get order details
- getBuyerOrders()     // Get buyer's orders
- getSellerOrders()    // Get seller's orders
- updateStatus()       // Update order status
- updatePaymentStatus()// Update payment status
- completeOrder()      // Mark as completed
- cancelOrder()        // Cancel order
- getSalesReport()     // Get sales report
```

## 🚀 Server Actions

Located in `app/api/actions.ts`:

### Authentication
- `loginAction(email, password)` - User login
- `registerPembeliAction(data)` - Register buyer
- `registerPenjualAction(data)` - Register seller
- `logoutAction()` - Logout user

### Menu Management
- `getMenusAction(filters)` - Get all menus
- `getSellerMenusAction(penjualId)` - Get seller menus
- `createMenuAction(penjualId, data)` - Create menu

### Cart Operations
- `getCartAction(pembeliId)` - Get cart
- `addToCartAction(pembeliId, menuId, quantity)` - Add item
- `removeFromCartAction(pembeliId, menuId)` - Remove item

### Orders
- `createOrderAction(pembeliId, penjualId, data)` - Create order
- `getBuyerOrdersAction(pembeliId)` - Get buyer orders
- `getSellerOrdersAction(penjualId)` - Get seller orders
- `updateOrderStatusAction(orderId, status)` - Update status

## 📦 Using Database Operations

### In Server Actions
```typescript
// app/api/actions.ts
import { menuDb, cartDb, orderDb } from "@/lib/db";

export async function getMenusAction() {
  const menus = await menuDb.getAllMenus({
    isAvailable: true,
    categoryId: "cat_123",
  });
  return { success: true, data: menus };
}
```

### In API Routes (if needed)
```typescript
// app/api/menus/route.ts
import { menuDb } from "@/lib/db";

export async function GET(req: Request) {
  const menus = await menuDb.getAllMenus();
  return Response.json(menus);
}
```

## 🔐 Security Best Practices

1. **Password Hashing**
   - Menggunakan `bcryptjs` untuk hash password
   - Never store plain passwords
   - Verify dengan `compare()` saat login

2. **Session Management**
   - Store user ID di httpOnly cookies
   - Validate user ownership sebelum modify data
   - Clear cookies pada logout

3. **Database Access**
   - Use Prisma's type-safety untuk prevent SQL injection
   - Validate input dengan Zod schemas
   - Check user ownership/permissions sebelum operations

## 📊 Data Migrations

### From localStorage to Database

**Before (localStorage)**
```typescript
// Old way
const users = JSON.parse(localStorage.getItem('users') || '[]');
users.push(newUser);
localStorage.setItem('users', JSON.stringify(users));
```

**After (Database)**
```typescript
// New way
const user = await userDb.registerPembeli({
  username,
  email,
  password,
  fullName,
  phone,
});
```

### Removing Old localStorage Code

Files to update/remove:
- `lib/storage.ts` - Remove or deprecate localStorage helpers
- All `.tsx` files using `menuStorage`, `orderStorage`, `penjualSession`, `pembeliSession`
- Replace with database operations via server actions

## 🗄️ Database Management

### Commands

```bash
# Generate Prisma Client
npm run db:generate    # Already done

# Create/apply migrations
npm run db:migrate     # Create new migration interactively

# Push schema to database (without migrations)
npm run db:push        # Used initially for setup

# Seed database with initial data
npm run db:seed        # Populate test data

# Open Prisma Studio (GUI for database)
npm run db:studio      # Browse/edit data visually

# Reset database (DELETE ALL DATA)
npm run db:reset       # Only for development!
```

### Database Backup

```bash
# MySQL backup
mysqldump -u root kantinpintar > backup_$(date +%Y%m%d_%H%M%S).sql

# MySQL restore
mysql -u root kantinpintar < backup_20240508_120000.sql
```

## 🧪 Testing Data

### Default Test Accounts (from seed.ts)

```
Admin:
  Email: admin@kantinpintar.local
  Password: admin123
  Role: ADMIN

Seller:
  Email: seller@kantinpintar.local
  Password: seller123
  Role: PENJUAL
  Business: Kantin Demo

Buyer:
  Email: buyer@kantinpintar.local
  Password: buyer123
  Role: PEMBELI
```

### Sample Menus (auto-created with seller)
- Nasi Goreng Spesial (25.000)
- Mie Ayam (20.000)
- Es Teh Manis (5.000)
- Kopi Espresso (15.000)
- Bakso Malang (22.000)
- Lumpia Goreng (10.000)

## 🏗️ Architecture Flow

```
User Request
    ↓
Server Action (app/api/actions.ts)
    ↓
Zod Validation
    ↓
Database Operations (lib/db/*.ts)
    ↓
Prisma Client
    ↓
MySQL Database
    ↓
Response → Client
```

## 🔄 Context Integration (To Be Updated)

The existing contexts in `lib/context/` should be updated to consume database operations:

```typescript
// Future: CartContext should use cartDb instead of localStorage
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const addItem = async (pembeliId, menuId, quantity) => {
    const item = await cartDb.addItem(pembeliId, menuId, quantity);
    setItems(prev => [...prev, item]);
  };
  
  // ...
}
```

## 📋 Next Steps

1. **Run Seed** (resolve path issue on Windows)
   ```bash
   # Or manually insert test data via Prisma Studio
   npm run db:studio
   ```

2. **Update Existing Pages** to use database operations
   - Replace `localStorage` calls with server actions
   - Update contexts to consume `userDb`, `menuDb`, `cartDb`
   - Migrate state from client-side to server-side

3. **Create API Routes** if needed
   - For mobile app or external integrations
   - Use same `lib/db/` operations

4. **Testing & Validation**
   - Test all CRUD operations
   - Verify relationships integrity
   - Load testing for performance

5. **Production Deployment**
   - Setup proper database backup strategy
   - Configure connection pooling
   - Security hardening (SSL, encrypted passwords)
   - Monitoring & logging

## 📚 References

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma MySQL Guide](https://www.prisma.io/docs/reference/database-reference/connection-urls/mysql)
- [bcryptjs Documentation](https://www.npmjs.com/package/bcryptjs)
- [Zod Validation](https://zod.dev/)
