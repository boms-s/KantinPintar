/**
 * Penjual Service API - Get Seller Orders
 * GET /api/penjual/orders
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/middleware";
import { orderService } from "@/lib/services/orderService";
import { JWTPayload } from "@/lib/services/authService";

async function handler(
  request: NextRequest,
  auth: JWTPayload
): Promise<NextResponse> {
  try {
    const orders = await orderService.getBySellerId(auth.id);

    return NextResponse.json({ orders, count: orders.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export const GET = requireRole(["penjual"], handler);
