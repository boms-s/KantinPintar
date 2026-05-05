/**
 * Auth API - Seller (Penjual) Registration
 * POST /api/auth/register/penjual
 */

import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, phone, description, location } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, password" },
        { status: 400 }
      );
    }

    const { seller, token } = await authService.registerSeller(
      fullName,
      email,
      password,
      phone,
      description,
      location
    );

    return NextResponse.json(
      { seller, token, message: "Penjual registered successfully" },
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
