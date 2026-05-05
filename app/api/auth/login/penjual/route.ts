/**
 * Auth API - Seller (Penjual) Login
 * POST /api/auth/login/penjual
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email, password" },
        { status: 400 }
      );
    }

    const { seller, token } = await authService.loginSeller(email, password);

    return NextResponse.json(
      { seller, token, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Login failed",
      },
      { status: 401 }
    );
  }
}
