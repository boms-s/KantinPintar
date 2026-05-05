# KantinPintar - Setup & Getting Started Guide

## System Requirements

- **Node.js**: v18.17+ (LTS recommended)
- **npm**: v9+ or yarn
- **MariaDB**: v10.5+ running locally or remotely
- **Git**: For version control

## Project Overview

KantinPintar is a modern canteen/food ordering system with three main actors:
1. **Pembeli** (Buyers/Customers)
2. **Penjual** (Sellers/Vendors)
3. **Admin** (Platform Administrators)

### Technology Stack
- **Frontend/Backend**: Next.js 16+ (TypeScript)
- **Database**: MariaDB (MySQL 8.0 compatible)
- **ORM**: Prisma 7+
- **Authentication**: JWT
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI

---

## Initial Setup

### Step 1: Install Dependencies

```bash
cd KantinPintar
npm install
```

### Step 2: Configure Database

#### Option A: Local MariaDB Installation (Windows)

**Download & Install MariaDB:**
1. Download from: https://mariadb.org/download/
2. Run installer and complete setup
3. Set root password during installation
4. MariaDB Server will run as Windows Service (Port 3306)

**Verify MariaDB is Running:**
```bash
# Open MariaDB client
mysql -u root -p

# You should see the MySQL prompt
mysql>
```

#### Option B: Docker (Recommended for Development)

```bash
# Start MariaDB in Docker
docker run --name kantinpintar-db \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -p 3306:3306 \
  -d mariadb:latest

# Or use docker-compose
docker-compose up -d
```

**Create `.docker-compose.yml`:**
```yaml
version: '3.8'
services:
  mariadb:
    image: mariadb:latest
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: kantinpintar
    volumes:
      - mariadb_data:/var/lib/mysql

volumes:
  mariadb_data:
```

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Database - Update with your credentials
DATABASE_URL="mysql://root:your_password@localhost:3306/kantinpintar"

# JWT - Generate a strong secret for production
JWT_SECRET="your-secret-key-minimum-32-characters"
JWT_EXPIRATION="7d"

# Environment
NODE_ENV="development"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Step 4: Create Database & Run Migrations

```bash
# Create database (if not exists)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS kantinpintar;"

# Run Prisma migrations
npm run db:migrate

# Or push schema to database
npm run db:push
```

### Step 5: Seed Initial Data (Optional)

```bash
# Seed database with test data
npm run db:seed
```

This will populate the database with sample sellers, menu items, and users for testing.

### Step 6: Start Development Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

---

## Development Workflow

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint

# Database commands
npm run db:migrate     # Create new migration
npm run db:push        # Push schema to DB
npm run db:seed        # Run seed script
npm run db:studio      # Open Prisma Studio (GUI)
```

### Database Schema Changes

When you modify `prisma/schema.prisma`:

```bash
# Create and apply migration
npx prisma migrate dev --name describe_your_changes

# Example:
npx prisma migrate dev --name add_seller_ratings
```

### Prisma Studio (Database GUI)

Open interactive database viewer:
```bash
npm run db:studio
```

Access at: **http://localhost:5555**

---

## Project Structure

```
KantinPintar/
├── app/
│   ├── api/                    # API routes (microservices)
│   │   ├── auth/              # Authentication endpoints
│   │   ├── pembeli/           # Buyer service routes
│   │   ├── penjual/           # Seller service routes
│   │   ├── public/            # Public endpoints
│   │   └── migrate/           # Migration utilities
│   ├── admin/                 # Admin pages
│   ├── pembeli/               # Buyer pages
│   ├── penjual/               # Seller pages
│   └── page.tsx               # Home page
│
├── components/
│   ├── pembeli/               # Buyer components
│   ├── penjual/               # Seller components
│   └── *.tsx                  # Shared components
│
├── lib/
│   ├── services/              # Business logic services
│   │   ├── userService.ts
│   │   ├── sellerService.ts
│   │   ├── menuService.ts
│   │   ├── orderService.ts
│   │   ├── cartService.ts
│   │   ├── favoriteService.ts
│   │   └── authService.ts
│   │
│   ├── prisma.ts              # Prisma client singleton
│   ├── middleware.ts          # Auth & role middleware
│   ├── validation.ts          # Request validation
│   ├── pagination.ts          # Pagination utilities
│   ├── cache.ts               # Caching utilities
│   ├── migration.ts           # Data migration helpers
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
│
├── prisma/
│   ├── schema.prisma          # Prisma schema (database models)
│   ├── migrations/            # Migration history
│   └── seed.ts                # Seed script
│
├── public/                    # Static files
├── .env.local                 # Environment variables (local, not committed)
├── .env.example               # Example env variables
├── prisma.config.ts           # Prisma configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies & scripts
│
├── API_DOCUMENTATION.md       # API endpoints documentation
├── PERFORMANCE_GUIDE.md       # Performance optimization guide
└── README.md                  # Project readme
```

---

## API Endpoints Overview

### Authentication
- `POST /api/auth/register/pembeli` - Register buyer
- `POST /api/auth/register/penjual` - Register seller
- `POST /api/auth/login/pembeli` - Login buyer
- `POST /api/auth/login/penjual` - Login seller

### Public (No Auth Required)
- `GET /api/public/menus` - Get all menu items
- `GET /api/public/sellers` - Get all sellers

### Pembeli (Buyer) - Requires JWT
- `GET /api/pembeli/profile` - Get buyer profile
- `GET /api/pembeli/orders` - Get buyer orders

### Penjual (Seller) - Requires JWT
- `GET /api/penjual/menus` - Get seller's menus
- `POST /api/penjual/menus` - Create menu item
- `GET /api/penjual/orders` - Get seller's orders

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoints.

---

## Testing the API

### Using cURL

```bash
# Register buyer
curl -X POST http://localhost:3000/api/auth/register/pembeli \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login/pembeli \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get profile (with token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/pembeli/profile
```

### Using Postman/Insomnia

1. Import API endpoints from [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Create environment variables:
   - `base_url`: http://localhost:3000
   - `token`: (JWT token from login response)
3. Use `{{base_url}}` and `{{token}}` in requests

---

## Troubleshooting

### MariaDB Connection Error
```
Error: Prisma Client cannot connect to MySQL database
```

**Solutions:**
1. Verify MariaDB is running: `mysql -u root -p`
2. Check DATABASE_URL format: `mysql://user:password@host:port/database`
3. Ensure database exists: `CREATE DATABASE kantinpintar;`
4. Check port 3306 is available

### Migration Issues
```
Error: P3014 Migration not found
```

**Solutions:**
```bash
# Reset and try again
npx prisma migrate reset  # Warning: Deletes all data
npm run db:seed          # Re-seed test data
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run db:migrate
```

### JWT Token Errors
- Ensure `.env.local` has `JWT_SECRET` set
- Token expires in 7 days by default
- Include token in header: `Authorization: Bearer {token}`

---

## Next Steps

1. **Review Architecture**: Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Optimize Performance**: Check [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)
3. **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Frontend Integration**: Connect React pages to API endpoints
5. **Add Features**: Extend with payment, notifications, etc.

---

## Support & Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **MariaDB Docs**: https://mariadb.com/docs/
- **JWT**: https://jwt.io/

---

## Version History

- **v0.1.0** (May 2026) - Initial setup with Prisma & MariaDB
  - Database models
  - Microservices architecture
  - JWT authentication
  - API endpoints
