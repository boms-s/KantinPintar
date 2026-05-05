/**
 * Public API - Get All Sellers
 * GET /api/public/sellers
 */

import { NextRequest, NextResponse } from "next/server";
import { sellerService } from "@/lib/services/sellerService";

export async function GET(request: NextRequest) {
  try {
    const sellers = await sellerService.getAll();
    return NextResponse.json(
      { sellers, count: sellers.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return NextResponse.json(
      { error: "Failed to fetch sellers" },
      { status: 500 }
    );
  }
}
