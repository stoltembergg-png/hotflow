import { NextRequest } from "next/server";
import { verifyToken, type JwtPayload } from "@/lib/auth";

/**
 * Extracts and verifies the JWT from the request cookie.
 * Returns the payload or null if not authenticated.
 */
export function getAuth(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get("hotflow-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Requires authentication. Returns the payload or throws a 401 Response.
 * Use in API routes:
 *   const auth = requireAuth(request);
 *   if (auth instanceof Response) return auth;
 *   // auth is now JwtPayload
 */
export function requireAuth(request: NextRequest): JwtPayload | Response {
  const payload = getAuth(request);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return payload;
}

/**
 * Helper to get orgId from a request, returning null if not authenticated.
 */
export function getOrgId(request: NextRequest): string | null {
  const payload = getAuth(request);
  return payload?.orgId ?? null;
}
