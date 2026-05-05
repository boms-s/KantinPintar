/**
 * Order Service - Order management
 * Handles order CRUD, status updates, and retrieval
 */

import { prisma } from "@/lib/prisma";
import { Order, CartItem } from "@/lib/types";

export const orderService = {
  // Get all orders
  getAll: async (): Promise<Order[]> => {
    const orders = await prisma.order.findMany({
      include: { items: { include: { menuItem: true } } },
    });
    return orders.map(mapOrderToOrder);
  },

  // Get order by ID
  getById: async (id: string): Promise<Order | null> => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } } },
    });
    return order ? mapOrderToOrder(order) : null;
  },

  // Get orders by user
  getByUserId: async (userId: string): Promise<Order[]> => {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
    });
    return orders.map(mapOrderToOrder);
  },

  // Get orders by seller
  getBySellerId: async (sellerId: string): Promise<Order[]> => {
    const orders = await prisma.order.findMany({
      where: { sellerId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
    });
    return orders.map(mapOrderToOrder);
  },

  // Get orders by status
  getByStatus: async (
    status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  ): Promise<Order[]> => {
    const orders = await prisma.order.findMany({
      where: { status },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: "desc" },
    });
    return orders.map(mapOrderToOrder);
  },

  // Create order
  create: async (orderData: {
    userId: string;
    sellerId: string;
    items: CartItem[];
    totalPrice: number;
    notes?: string;
  }): Promise<Order> => {
    const order = await prisma.order.create({
      data: {
        userId: orderData.userId,
        sellerId: orderData.sellerId,
        totalPrice: orderData.totalPrice,
        notes: orderData.notes,
        items: {
          create: orderData.items.map((item) => ({
            menuItemId: item.id,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
      include: { items: { include: { menuItem: true } } },
    });
    return mapOrderToOrder(order);
  },

  // Update order status
  updateStatus: async (
    id: string,
    status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  ): Promise<Order> => {
    const order = await prisma.order.update({
      where: { id },
      data: { status, updatedAt: new Date() },
      include: { items: { include: { menuItem: true } } },
    });
    return mapOrderToOrder(order);
  },

  // Update order
  update: async (id: string, updates: Partial<Order>): Promise<Order> => {
    const order = await prisma.order.update({
      where: { id },
      data: updates,
      include: { items: { include: { menuItem: true } } },
    });
    return mapOrderToOrder(order);
  },

  // Delete order
  delete: async (id: string): Promise<void> => {
    await prisma.order.delete({
      where: { id },
    });
  },

  // Get total spent by user
  getTotalSpent: async (userId: string): Promise<number> => {
    const result = await prisma.order.aggregate({
      where: {
        userId,
        status: "completed",
      },
      _sum: {
        totalPrice: true,
      },
    });
    return Number(result._sum.totalPrice || 0);
  },

  // Get total revenue by seller
  getTotalRevenue: async (sellerId: string): Promise<number> => {
    const result = await prisma.order.aggregate({
      where: {
        sellerId,
        status: "completed",
      },
      _sum: {
        totalPrice: true,
      },
    });
    return Number(result._sum.totalPrice || 0);
  },
};

// Helper: Map Prisma Order to Order type
function mapOrderToOrder(order: any): Order {
  return {
    id: order.id,
    userId: order.userId,
    items: order.items.map((oi: any) => ({
      id: oi.menuItem.id,
      name: oi.menuItem.name,
      price: Number(oi.price),
      qty: oi.qty,
      penjualId: oi.menuItem.sellerId,
      penjualName: oi.menuItem.penjualName,
      description: oi.menuItem.description,
      image: oi.menuItem.image,
      category: oi.menuItem.category,
      available: oi.menuItem.available,
    })),
    totalPrice: Number(order.totalPrice),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
    notes: order.notes || undefined,
  };
}
