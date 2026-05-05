/**
 * Pembeli Service API - Get User Profile
 * GET /api/pembeli/profile
 */

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/middleware";
import { userService } from "@/lib/services/userService";
import { JWTPayload } from "@/lib/services/authService";

async function handler(
  request: NextRequest,
  auth: JWTPayload
): Promise<NextResponse> {
  try {
    const user = await userService.getById(auth.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export const GET = requireRole(["pembeli"], handler);
