# Performance Optimization Guide

## Database Performance

### Current Indexes (in schema.prisma)
The following indexes are already configured for performance:

```
User:
- @@index([email])
- @@index([role])

Seller:
- @@index([email])
- @@index([role])

MenuItem:
- @@index([sellerId])
- @@index([category])
- @@index([available])

Order:
- @@index([userId])
- @@index([sellerId])
- @@index([status])
- @@index([createdAt])

OrderItem:
- @@index([orderId])
- @@index([menuItemId])

CartItem:
- @@unique([userId, menuItemId])
- @@index([userId])
- @@index([menuItemId])
```

### Additional Recommended Indexes
For high-traffic scenarios, consider adding:

```prisma
// In schema.prisma MenuItem model
@@index([createdAt]) // For recent items queries
@@index([sellerId, available]) // For seller's available items

// In schema.prisma Order model
@@index([sellerId, status]) // For seller's pending orders
@@index([userId, status]) // For user's order history

// In schema.prisma CartItem model
@@index([userId, createdAt]) // For active carts
```

Apply with: `npx prisma migrate dev --name add_performance_indexes`

---

## Pagination Implementation

### Usage Example
```typescript
import { getPaginationParams, createPaginatedResponse } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { page, limit, skip } = getPaginationParams(request);
  
  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({ skip, take: limit }),
    prisma.menuItem.count(),
  ]);

  const response = createPaginatedResponse(items, total, page, limit);
  return NextResponse.json(response);
}
```

### Query Parameters
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, max: 100)

### Example Requests
```
GET /api/public/menus?page=1&limit=20
GET /api/penjual/orders?page=2&limit=50
```

---

## Caching Strategy

### 1. Database Query Caching
```typescript
import { cache, withCache } from "@/lib/cache";

// Using withCache helper
const menus = await withCache("menu:all", async () => {
  return await menuService.getAll();
}, 5 * 60 * 1000); // 5 minutes
```

### 2. Pattern-Based Cache Invalidation
```typescript
import { cache } from "@/lib/cache";

// When menu is updated, invalidate related caches
await menuService.update(id, data);
cache.deletePattern("menu:*");
cache.deletePattern(`seller:${sellerId}:*`);
```

### 3. Cache TTL Recommendations
```typescript
const CACHE_TTL = {
  MENU_ITEMS: 5 * 60 * 1000,      // 5 minutes
  SELLERS: 10 * 60 * 1000,        // 10 minutes
  USER_PROFILE: 15 * 60 * 1000,   // 15 minutes (invalidate on update)
  ORDERS: 2 * 60 * 1000,          // 2 minutes (frequently changing)
  STATS: 1 * 60 * 1000,           // 1 minute (frequently changing)
};
```

---

## Batch Operations

### Bulk Create Menu Items
```typescript
import { prisma } from "@/lib/prisma";

const items = await prisma.menuItem.createMany({
  data: [
    { name: "Item 1", price: 10000, sellerId: "seller1" },
    { name: "Item 2", price: 20000, sellerId: "seller1" },
    // ... more items
  ],
});
```

### Bulk Update Orders
```typescript
// Update multiple orders at once
await prisma.order.updateMany({
  where: { sellerId: "seller1", status: "pending" },
  data: { status: "confirmed" },
});
```

### Bulk Delete
```typescript
// Delete old carts (older than 7 days)
await prisma.cartItem.deleteMany({
  where: {
    createdAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  },
});
```

---

## API Response Optimization

### 1. Select Only Required Fields
```typescript
// BAD: Returns all fields
const users = await prisma.user.findMany();

// GOOD: Return only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    fullName: true,
    email: true,
  },
});
```

### 2. Lazy Load Relationships
```typescript
// BAD: Always include heavy relationships
const orders = await prisma.order.findMany({
  include: { items: { include: { menuItem: true } } },
});

// GOOD: Load separately if needed
const orders = await prisma.order.findMany();
// Load items only when requested
const orderWithItems = await prisma.order.findUnique({
  where: { id: orderId },
  include: { items: { include: { menuItem: true } } },
});
```

### 3. Response Compression
```typescript
// Next.js automatically compresses responses with gzip
// Ensure .next/config has compression enabled
// No additional code needed for most deployments
```

---

## Database Connection Pooling

### Current Setup (PrismaClient)
```typescript
// lib/prisma.ts - Already configured
const prisma = new PrismaClient({
  log: ["error"], // Reduce logging in production
});
```

### For High Traffic (Production)
Add connection pooling with PgBouncer or MySQL Router:
```
DATABASE_URL="mysql://root:password@pgbouncer-proxy:3306/kantinpintar?schema=public"
```

---

## Monitoring & Performance Metrics

### 1. Enable Query Logging (Development Only)
```typescript
const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});
```

### 2. Measure Response Times
```typescript
// Middleware to track performance
export function performanceMiddleware(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const start = performance.now();
    const response = await handler(request);
    const duration = performance.now() - start;

    console.log(`${request.method} ${request.nextUrl.pathname}: ${duration.toFixed(2)}ms`);

    // Add header for monitoring
    response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);

    return response;
  };
}
```

### 3. Database Query Performance
```
Rule of thumb:
- Simple queries (single record): < 10ms
- List queries (with pagination): < 50ms
- Complex joins: < 100ms
- Batch operations: < 500ms
```

---

## Load Testing Recommendations

### Using Artillery or Apache JMeter
```bash
# Install Artillery
npm install -g artillery

# Create test script (load-test.yml)
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"

scenarios:
  - name: "Browse products"
    flow:
      - get:
          url: "/api/public/menus?limit=20"
      - get:
          url: "/api/public/sellers"

# Run test
artillery run load-test.yml
```

---

## Production Deployment Checklist

- [ ] Enable response compression
- [ ] Use appropriate cache headers
- [ ] Implement database connection pooling
- [ ] Monitor database performance
- [ ] Set up log aggregation
- [ ] Configure rate limiting
- [ ] Use environment-specific DB connections
- [ ] Implement CDN for static assets
- [ ] Set up database backups
- [ ] Enable query monitoring
- [ ] Configure horizontal scaling
- [ ] Use read replicas for high-traffic queries

---

## Environment Configuration

### Development (.env.local)
```
NODE_ENV=development
DATABASE_URL=mysql://root@localhost:3306/kantinpintar
JWT_SECRET=dev-secret
```

### Production (.env.production)
```
NODE_ENV=production
DATABASE_URL=mysql://prod_user:password@prod-db:3306/kantinpintar?connectionLimit=10
JWT_SECRET=strong-production-secret
ENABLE_COMPRESSION=true
```

---

## Further Reading

- Prisma Performance: https://www.prisma.io/docs/orm/prisma-client/deployment/production
- MySQL Optimization: https://dev.mysql.com/doc/
- Next.js Performance: https://nextjs.org/learn/foundations/how-nextjs-works/production
- Caching Strategies: https://www.patterns.dev/posts/caching-strategy/
