/**
 * Public API - Get All Menu Items
 * GET /api/public/menus
 */

import { NextRequest, NextResponse } from "next/server";
import { menuService } from "@/lib/services/menuService";

export async function GET(request: NextRequest) {
  try {
    const menus = await menuService.getAll();
    return NextResponse.json({ menus, count: menus.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    );
  }
}
