# Smart Kantin - Arsitektur & Implementasi Phase 2

## 📐 Atomic Design Pattern

Project menggunakan Atomic Design Pattern untuk komponen UI yang scalable dan reusable.

### Struktur Komponen

```
components/
├── atoms/          # Komponen dasar tanpa logic
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Label.tsx
│   └── Skeleton.tsx
├── molecules/      # Kombinasi atoms dengan simple logic
│   ├── FormField.tsx
│   ├── MenuCard.tsx
│   └── ListItem.tsx
├── organisms/      # Complex components
│   ├── LoginForm.tsx
│   ├── MenuGrid.tsx
│   └── OrderList.tsx
└── index.ts        # Central exports
```

## 🎯 State Management

Menggunakan **React Context API** + **Custom Hooks** untuk state management yang sederhana dan maintainable.

### Context Providers

```
lib/context/
├── AuthContext.tsx     # User authentication state
├── CartContext.tsx     # Shopping cart state
├── MenuContext.tsx     # Menu items state
└── index.tsx           # Combined AppProviders
```

### Usage

```tsx
// app/layout.tsx
import { AppProviders } from "@/lib/context";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

// Any component
"use client";
import { useAuth, useCart, useMenu } from "@/lib";

export function MyComponent() {
  const { user, logout } = useAuth();
  const { items, addItem } = useCart();
  const { items: menus } = useMenu();
  
  // ...
}
```

## 🔌 API Layer - Server Actions

Next.js 16 **Server Actions** untuk komunikasi client-server yang type-safe.

### Structure

```
app/api/
└── actions.ts   # All server actions (auth, menu, order)
```

### Server Actions Pattern

```tsx
// app/api/actions.ts
"use server";

import { z } from "zod";

// Validation schemas
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Server actions
export async function loginPembeli(data: LoginInput) {
  // Validation
  // Database query
  // Return result
}
```

### Calling Server Actions

```tsx
"use client";
import { loginPembeli } from "@/app/api/actions";

export function LoginForm() {
  async function handleSubmit(formData) {
    const result = await loginPembeli(formData);
    // Handle result
  }
}
```

## 📦 Performance & Optimization

### 1. **Client Component Boundaries**
- Minimal `"use client"` directives
- Server components by default
- Server actions for data operations

### 2. **Memoization**
```tsx
// Use useMemo untuk expensive calculations
const filteredItems = useMemo(
  () => items.filter(item => item.category === selected),
  [items, selected]
);
```

### 3. **Loading States**
```tsx
import { Skeleton, SkeletonCard } from "@/components";

{loading ? <SkeletonCard /> : <MenuCard />}
```

### 4. **Image Optimization**
```tsx
import Image from "next/image";

<Image 
  src={menu.image}
  alt={menu.name}
  width={300}
  height={200}
  className="object-cover"
/>
```

## 🗂️ File Organization

```
KantinPintar/
├── app/                    # Next.js app directory
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── api/
│   │   └── actions.ts      # Server actions
│   ├── admin/
│   ├── pembeli/
│   └── penjual/
├── components/
│   ├── atoms/              # Basic components
│   ├── molecules/          # Compound components
│   ├── organisms/          # Complex components
│   └── index.ts            # Central exports
├── lib/
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── types.ts            # Type definitions
│   ├── storage.ts          # Storage utilities
│   ├── utils.ts            # Utility functions
│   └── index.ts            # Central exports
└── prisma/
    └── schema.prisma       # Database schema
```

## 🚀 Development Workflow

### 1. Creating New Component

```tsx
// 1. Create atom in components/atoms/
// 2. Export in components/index.ts

export { MyAtom } from "./atoms/MyAtom";

// 3. Use in components
import { MyAtom } from "@/components";
```

### 2. Adding New State

```tsx
// 1. Create context in lib/context/NewContext.tsx
// 2. Export in lib/context/index.tsx
// 3. Add to AppProviders in lib/context/index.tsx
// 4. Use with custom hook
```

### 3. Creating Server Action

```tsx
// 1. Add function in app/api/actions.ts
// 2. Add validation schema
// 3. Import and call from client component
```

## ✅ Testing Checklist

- [ ] Components render without errors
- [ ] State updates correctly
- [ ] Server actions handle errors
- [ ] Loading states show properly
- [ ] Mobile responsive layout
- [ ] Dark mode works
- [ ] No console errors

## 🔄 Next Steps

1. **Molecule Components**: LoginForm, RegisterForm, MenuGrid, OrderList
2. **Organism Components**: DashboardHeader, MenuSection, CartSummary
3. **API Integration**: Prisma integration for database operations
4. **Migration**: Replace localStorage with server data
5. **Testing**: Unit tests, integration tests
