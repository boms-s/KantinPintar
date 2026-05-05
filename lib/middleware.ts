/**
 * Authentication Middleware
 * Validates JWT tokens and checks user roles
 */

import { NextRequest, NextResponse } from "next/server";
import { authService, JWTPayload } from "@/lib/services/authService";

/**
 * Extract and verify JWT from Authorization header
 */
export function verifyAuth(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  return authService.verifyToken(token);
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
  handler: (
    request: NextRequest,
    auth: JWTPayload
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }
    return handler(request, auth);
  };
}

/**
 * Middleware to require specific role
 */
export function requireRole(
  allowedRoles: ("pembeli" | "penjual" | "admin")[],
  handler: (
    request: NextRequest,
    auth: JWTPayload
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(auth.role)) {
      return NextResponse.json(
        { error: `Forbidden: This resource requires role(s): ${allowedRoles.join(", ")}` },
        { status: 403 }
      );
    }

    return handler(request, auth);
  };
}
