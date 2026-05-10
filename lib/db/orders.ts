/**
 * Orders/Transactions Database Operations
 */

import { prisma } from "@/lib/prisma";

export const orderDb = {
  /**
   * Create new order from cart
   */
  async createOrder(
    pembeliId: string,
    penjualId: string,
    data: {
      items: Array<{
        menuId: string;
        quantity: number;
        unitPrice: number;
      }>;
      subtotal: number;
      tax?: number;
      discountAmount?: number;
      shippingCost?: number;
      totalPrice: number;
      paymentMethod: string; // "CASH" | "TRANSFER" | "EWALLETS"
      deliveryType: string;   // "PICKUP" | "DELIVERY"
      deliveryAddress?: string;
      notes?: string;
    },
  ) {
    return prisma.order.create({
      data: {
        pembeliId,
        penjualId,
        transactionCode: `ORD-${Date.now()}`,
        status: "PENDING",
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discountAmount: data.discountAmount || 0,
        shippingCost: data.shippingCost || 0,
        totalPrice: data.totalPrice,
        paymentMethod: data.paymentMethod as any,
        deliveryType: data.deliveryType as any,
        deliveryAddress: data.deliveryAddress,
        notes: data.notes,
        items: {
          createMany: {
            data: data.items.map((item) => ({
              menuId: item.menuId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
            })),
          },
        },
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        pembeli: true,
        penjual: true,
      },
    });
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string) {
    return prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        pembeli: true,
        penjual: true,
        payment: true,
        review: true,
      },
    });
  },

  /**
   * Get buyer's orders
   */
  async getBuyerOrders(
    pembeliId: string,
    filters?: {
      status?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    return prisma.order.findMany({
      where: {
        pembeliId,
        status: filters?.status as any,
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        penjual: {
          select: {
            id: true,
            businessName: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
    });
  },

  /**
   * Get seller's orders
   */
  async getSellerOrders(
    penjualId: string,
    filters?: {
      status?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    return prisma.order.findMany({
      where: {
        penjualId,
        status: filters?.status as any,
      },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        pembeli: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
    });
  },

  /**
   * Update order status
   */
  async updateStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
      include: {
        items: true,
        pembeli: true,
        penjual: true,
      },
    });
  },

  /**
   * Update order payment status
   */
  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: paymentStatus as any,
      },
    });
  },

  /**
   * Complete order
   */
  async completeOrder(orderId: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED" as any,
        completedAt: new Date(),
      },
    });
  },

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED" as any,
        notes: reason || "Pesanan dibatalkan",
      },
    });
  },

  /**
   * Get sales report for seller
   */
  async getSalesReport(
    penjualId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const orders = await prisma.order.findMany({
      where: {
        penjualId,
        status: "COMPLETED" as any,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + order.totalPrice,
      0,
    );
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      orders,
    };
  },
};
