/**
 * Request Validation Middleware
 * Validates request bodies and query parameters
 */

import { NextRequest, NextResponse } from "next/server";

export type ValidationSchema = {
  [key: string]: {
    type: "string" | "number" | "boolean" | "email" | "array";
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
};

/**
 * Validate request body against schema
 */
export function validateBody(schema: ValidationSchema) {
  return async (handler: (req: NextRequest, body: any) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      if (request.method !== "POST" && request.method !== "PUT" && request.method !== "PATCH") {
        return handler(request, {});
      }

      try {
        const body = await request.json();
        const errors: { [key: string]: string } = {};

        for (const [field, rules] of Object.entries(schema)) {
          const value = body[field];

          // Check required
          if (rules.required && (value === undefined || value === null || value === "")) {
            errors[field] = `${field} is required`;
            continue;
          }

          if (value === undefined || value === null) continue;

          // Check type
          const actualType = Array.isArray(value) ? "array" : typeof value;
          if (rules.type === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors[field] = `${field} must be a valid email`;
            }
          } else if (actualType !== rules.type) {
            errors[field] = `${field} must be a ${rules.type}`;
          }

          // Check string length
          if (typeof value === "string") {
            if (rules.min && value.length < rules.min) {
              errors[field] = `${field} must be at least ${rules.min} characters`;
            }
            if (rules.max && value.length > rules.max) {
              errors[field] = `${field} must be at most ${rules.max} characters`;
            }
          }

          // Check pattern
          if (rules.pattern && typeof value === "string" && !rules.pattern.test(value)) {
            errors[field] = `${field} has invalid format`;
          }
        }

        if (Object.keys(errors).length > 0) {
          return NextResponse.json({ errors }, { status: 400 });
        }

        return handler(request, body);
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid request body" },
          { status: 400 }
        );
      }
    };
  };
}

/**
 * Rate limiting middleware (simple in-memory implementation)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (request: NextRequest) => {
      const clientIp =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";

      const now = Date.now();
      const data = rateLimitStore.get(clientIp);

      if (data && data.resetTime > now) {
        if (data.count >= maxRequests) {
          return NextResponse.json(
            { error: "Too many requests, please try again later" },
            { status: 429 }
          );
        }
        data.count++;
      } else {
        rateLimitStore.set(clientIp, { count: 1, resetTime: now + windowMs });
      }

      return handler(request);
    };
  };
}
