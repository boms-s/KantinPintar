/**
 * API Route for Database Seeding (Development Only)
 * POST /api/migrate/seed
 * WARNING: Only enable in development!
 */

import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";

export async function POST(request: NextRequest) {
  // Security: Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding is disabled in production" },
      { status: 403 }
    );
  }

  try {
    console.log("🌱 Running Prisma seed...");

    // Run seed using Prisma CLI
    // Note: Requires ts-node configured in package.json
    execSync("npx prisma db seed", { stdio: "inherit" });

    return NextResponse.json(
      { success: true, message: "Database seeded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json(
      { error: "Seeding failed", details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check if seeding is available
export async function GET(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";
  return NextResponse.json({
    seedingAvailable: isDevelopment,
    message: isDevelopment
      ? "POST to /api/migrate/seed to run seeds"
      : "Seeding disabled in production",
  });
}
