/**
 * Penjual Service API - Get/Create Menu Items
 * GET /api/penjual/menus
 * POST /api/penjual/menus
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/middleware";
import { menuService } from "@/lib/services/menuService";
import { JWTPayload } from "@/lib/services/authService";

async function handleGet(
  request: NextRequest,
  auth: JWTPayload
): Promise<NextResponse> {
  try {
    const menus = await menuService.getBySellerId(auth.id);
    return NextResponse.json({ menus, count: menus.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching seller menus:", error);
    return NextResponse.json(
      { error: "Failed to fetch menus" },
      { status: 500 }
    );
  }
}

async function handlePost(
  request: NextRequest,
  auth: JWTPayload
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, price, description, category, available } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, price" },
        { status: 400 }
      );
    }

    const menu = await menuService.create({
      name,
      price: Number(price),
      sellerId: auth.id,
      description,
      category,
      available: available !== false,
    });

    return NextResponse.json(
      { menu, message: "Menu item created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating menu:", error);
    return NextResponse.json(
      { error: "Failed to create menu" },
      { status: 500 }
    );
  }
}

export const GET = requireRole(["penjual"], handleGet);
export const POST = requireRole(["penjual"], handlePost);
