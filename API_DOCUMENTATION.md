# KantinPintar Microservices API Documentation

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     Next.js Frontend & API Gateway      │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌────────────────┐  │
│  │ Auth Service │  │ Public API     │  │
│  └──────────────┘  └────────────────┘  │
│                                         │
│  ┌──────────────┐  ┌────────────────┐  │
│  │ Pembeli Svc  │  │ Penjual Svc    │  │
│  └──────────────┘  └────────────────┘  │
│                                         │
│  ┌──────────────┐  ┌────────────────┐  │
│  │ Admin Svc    │  │ Public Routes  │  │
│  └──────────────┘  └────────────────┘  │
│                                         │
└────────────────┬────────────────────────┘
                 │
          ┌──────▼──────┐
          │   MariaDB   │
          │ (Prisma)    │
          └─────────────┘
```

## Authentication Endpoints

### Register Pembeli (Buyer)
**POST** `/api/auth/register/pembeli`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "pembeli"
  },
  "token": "jwt_token",
  "message": "Pembeli registered successfully"
}
```

### Register Penjual (Seller)
**POST** `/api/auth/register/penjual`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "description": "string (optional)",
  "location": "string (optional)"
}
```

**Response:**
```json
{
  "seller": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "penjual"
  },
  "token": "jwt_token",
  "message": "Penjual registered successfully"
}
```

### Login Pembeli
**POST** `/api/auth/login/pembeli`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Login Penjual
**POST** `/api/auth/login/penjual`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

---

## Pembeli (Buyer) Service Endpoints

### Get Profile
**GET** `/api/pembeli/profile`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "role": "pembeli"
  }
}
```

### Get Orders
**GET** `/api/pembeli/orders`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "orders": [
    {
      "id": "string",
      "userId": "string",
      "items": [...],
      "totalPrice": "number",
      "status": "pending|confirmed|preparing|ready|completed|cancelled",
      "createdAt": "ISO date"
    }
  ],
  "count": "number"
}
```

---

## Penjual (Seller) Service Endpoints

### Get Seller Orders
**GET** `/api/penjual/orders`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "orders": [...],
  "count": "number"
}
```

### Get Seller Menus
**GET** `/api/penjual/menus`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "menus": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "description": "string",
      "available": "boolean"
    }
  ],
  "count": "number"
}
```

### Create Menu Item
**POST** `/api/penjual/menus`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Request Body:**
```json
{
  "name": "string",
  "price": "number",
  "description": "string (optional)",
  "category": "string (optional)",
  "available": "boolean (default: true)"
}
```

**Response:**
```json
{
  "menu": {...},
  "message": "Menu item created successfully"
}
```

---

## Public API Endpoints

### Get All Menus
**GET** `/api/public/menus`

No authentication required.

**Response:**
```json
{
  "menus": [...],
  "count": "number"
}
```

### Get All Sellers
**GET** `/api/public/sellers`

No authentication required.

**Response:**
```json
{
  "sellers": [...],
  "count": "number"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message"
}
```

**Common Error Codes:**
- `400` - Bad Request (missing or invalid fields)
- `401` - Unauthorized (invalid or missing JWT token)
- `403` - Forbidden (user role not allowed)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Security

1. **JWT Tokens**: All protected endpoints require a valid JWT token in the `Authorization` header with format: `Bearer {token}`
2. **Token Expiration**: Tokens expire in 7 days
3. **Role-Based Access Control**: Endpoints are protected by role (pembeli, penjual, admin)
4. **Password Security**: TODO - Implement bcrypt for password hashing

---

## Database Schema

### Users
- `id` (String, PK)
- `fullName` (String)
- `email` (String, Unique)
- `password` (String, hashed)
- `phone` (String, optional)
- `address` (String, optional)
- `role` (String, default: "pembeli")

### Sellers
- `id` (String, PK)
- `fullName` (String)
- `email` (String, Unique)
- `password` (String, hashed)
- `phone` (String, optional)
- `description` (Text, optional)
- `rating` (Float, default: 0)
- `location` (String, optional)
- `role` (String, default: "penjual")

### MenuItems
- `id` (String, PK)
- `name` (String)
- `price` (Decimal)
- `description` (Text, optional)
- `category` (String, optional)
- `available` (Boolean, default: true)
- `sellerId` (FK to Sellers)

### Orders
- `id` (String, PK)
- `userId` (FK to Users)
- `sellerId` (FK to Sellers)
- `totalPrice` (Decimal)
- `status` (String)
- `createdAt` (DateTime)

### OrderItems
- `id` (String, PK)
- `orderId` (FK to Orders)
- `menuItemId` (FK to MenuItems)
- `qty` (Int)
- `price` (Decimal)

---

## Deployment Notes

1. **Environment Variables**: Set `JWT_SECRET` and `DATABASE_URL` in production
2. **Password Hashing**: Implement bcrypt for password security
3. **Rate Limiting**: Add rate limiting middleware for public endpoints
4. **CORS**: Configure CORS for frontend domain
5. **API Versioning**: Consider adding `/v1/` to API routes for versioning

---

## Future Enhancements

- [ ] Add admin dashboard endpoints
- [ ] Implement payment gateway integration
- [ ] Add real-time notifications (WebSocket)
- [ ] Implement caching strategy (Redis)
- [ ] Add request logging and monitoring
- [ ] Implement API rate limiting
- [ ] Add file upload for images
- [ ] Implement search and filtering
