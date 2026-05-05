/**
 * Auth API - User (Pembeli) Registration
 * POST /api/auth/register/pembeli
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, address } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, password" },
        { status: 400 }
      );
    }

    const { user, token } = await authService.registerUser(
      fullName,
      email,
      password,
      phone,
      address
    );

    return NextResponse.json(
      { user, token, message: "Pembeli registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("unique")
    ) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan gunakan email lain." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    );
  }
}
