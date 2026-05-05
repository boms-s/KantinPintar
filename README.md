# 🍽️ KantinPintar - Smart Canteen Management System

**A modern, scalable web platform for managing food ordering and canteen operations with role-based access control for Buyers, Sellers, and Administrators.**

---

## 📋 Project Overview

KantinPintar is a microservices-based food ordering system built with modern technologies. It supports three main user roles with distinct features and permissions:

### 👥 User Roles

1. **Pembeli (Buyer/Customer)**
   - Browse menu items from multiple sellers
   - Add items to cart
   - Place orders
   - Track order status
   - View order history
   - Save favorite items

2. **Penjual (Seller/Vendor)**
   - Create and manage menu items
   - View incoming orders
   - Update order status
   - Track sales and revenue
   - Manage store profile
   - View analytics

3. **Admin (Platform Administrator)**
   - Monitor all transactions
   - Manage users and sellers
   - View platform analytics
   - Handle disputes
   - System configuration

---

## 🚀 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 16.2+ |
| **Runtime** | Node.js | 18.17+ |
| **Database** | MariaDB | 10.5+ |
| **ORM** | Prisma | 7.8+ |
| **Language** | TypeScript | 5.x |
| **Styling** | TailwindCSS | 4.x |
| **UI Components** | shadcn/ui + Radix UI | Latest |
| **Authentication** | JWT (jsonwebtoken) | Latest |
| **API** | REST + Microservices | - |

---

## 📁 Project Structure

```
KantinPintar/
├── 📂 app/                             # Next.js app directory
│   ├── api/                            # Microservices API routes
│   │   ├── auth/                       # Authentication service
│   │   ├── pembeli/                    # Buyer service
│   │   ├── penjual/                    # Seller service
│   │   ├── admin/                      # Admin service
│   │   ├── public/                     # Public endpoints
│   │   └── migrate/                    # Migration utilities
│   ├── admin/                          # Admin UI pages
│   ├── pembeli/                        # Buyer UI pages
│   └── penjual/                        # Seller UI pages
│
├── 📂 lib/
│   ├── services/                       # Business logic layer
│   ├── middleware.ts                   # Auth & role protection
│   ├── prisma.ts                       # Prisma client
│   └── ...other utilities
│
├── 📂 prisma/
│   ├── schema.prisma                   # Database schema
│   ├── migrations/                     # Migration history
│   └── seed.ts                         # Test data
│
├── 📖 SETUP.md                         # Setup instructions
├── 📖 DEPLOYMENT.md                    # Deployment guide
├── 📖 API_DOCUMENTATION.md             # API reference
└── 📖 PERFORMANCE_GUIDE.md             # Performance tuning
```

---

## ⚡ Quick Start

### 1️⃣ Prerequisites
- Node.js v18.17+
- MariaDB v10.5+
- npm v9+

### 2️⃣ Installation

```bash
git clone <repo>
cd KantinPintar
npm install
cp .env.example .env.local
# Edit .env.local with your DB credentials
```

### 3️⃣ Database Setup

```bash
npm run db:migrate
npm run db:seed  # Optional: load test data
```

### 4️⃣ Start Development

```bash
npm run dev
```

Visit http://localhost:3000

---

## 📚 Documentation

| Document | Contents |
|----------|----------|
| **[SETUP.md](./SETUP.md)** | Development setup, project structure, commands |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | All API endpoints with examples |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Production deployment options |
| **[PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)** | Optimization & scaling strategies |

---

## 🌐 API Endpoints

**Authentication**
```
POST /api/auth/register/pembeli
POST /api/auth/register/penjual
POST /api/auth/login/pembeli
POST /api/auth/login/penjual
```

**Public**
```
GET /api/public/menus
GET /api/public/sellers
```

**Pembeli & Penjual**
```
GET  /api/pembeli/profile      # (auth required)
GET  /api/penjual/menus        # (auth required)
POST /api/penjual/menus        # (auth required)
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

---

## 🛠️ Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production server
npm run db:migrate       # Create database migrations
npm run db:seed          # Seed test data
npm run db:studio        # Open Prisma Studio GUI
npm run lint             # Run ESLint
```

---

## 🔐 Security

✅ **Implemented**
- JWT authentication
- Role-based access control
- Input validation
- Query parameterization (Prisma)

⚠️ **For Production**
- [ ] Password hashing (bcrypt)
- [ ] HTTPS/SSL
- [ ] Rate limiting
- [ ] CORS configuration

---

## 📊 Database

- **Prisma ORM** for type-safe database access
- **MariaDB** for data persistence
- Automated migrations
- Seed scripts for testing
- Connection pooling ready

---

## 🚀 Deployment Options

- **Vercel** (recommended)
- **Docker** with Docker Compose
- **AWS** (Lambda, RDS, EC2)
- **Traditional VPS** (DigitalOcean, Linode, AWS EC2)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

## 🎯 Architecture

```
┌─────────────────────────────────┐
│   Next.js Frontend + API        │
├─────────────────────────────────┤
│  Auth Service | Public API      │
│  Pembeli Service | Penjual Svc  │
│  Admin Service                  │
├─────────────────────────────────┤
│  Middleware Layer               │
│  - Authentication               │
│  - Authorization                │
│  - Validation                   │
├─────────────────────────────────┤
│  Service Layer (Business Logic) │
│  - userService                  │
│  - sellerService                │
│  - orderService                 │
│  - menuService                  │
├─────────────────────────────────┤
│  Prisma ORM                     │
├─────────────────────────────────┤
│  MariaDB Database               │
└─────────────────────────────────┘
```

---

## 📈 Performance Features

- ✅ Pagination support
- ✅ In-memory caching
- ✅ Database query optimization
- ✅ Strategic indexing
- ✅ Batch operations

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request

---

## 📝 License

Educational/development use.

---

## 📞 Support

- Check [SETUP.md](./SETUP.md) for troubleshooting
- Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help

---

## 🔄 Project Status

**Current Version:** 0.1.0 (May 2026)

**Completed:**
- ✅ Database schema & migrations
- ✅ Prisma ORM setup
- ✅ Microservices architecture
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ API endpoints
- ✅ Seed script
- ✅ Documentation

**Next Steps:**
- [ ] Frontend UI implementation
- [ ] Payment gateway integration
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Mobile app

---

**For detailed information, see [SETUP.md](./SETUP.md) to get started.**
