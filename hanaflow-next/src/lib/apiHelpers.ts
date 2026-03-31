import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type JwtPayload } from "./auth";
import { z } from "zod";

const IS_PROD = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
  path: "/",
};

// ── Validation Zod ────────────────────────────────────────────────────────────
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): ValidationResult<T> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const msg = result.error.issues[0]?.message ?? "Données invalides";
    return { success: false, error: msg };
  }
  return { success: true, data: result.data };
}

// ── Réponses standard ─────────────────────────────────────────────────────────
export const ok = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export const err = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

// ── Auth middleware ───────────────────────────────────────────────────────────
export function getAuthUser(req: NextRequest): JwtPayload | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function requireAuth(
  req: NextRequest
): { user: JwtPayload } | NextResponse {
  const user = getAuthUser(req);
  if (!user) return err("Non authentifié", 401);
  return { user };
}

export function requireAdmin(
  req: NextRequest
): { user: JwtPayload } | NextResponse {
  const user = getAuthUser(req);
  if (!user) return err("Non authentifié", 401);
  if (user.role !== "admin") return err("Accès refusé", 403);
  return { user };
}

// ── Rate limiting (mémoire — suffisant pour MVP) ──────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxRequests = 15,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true; // autorisé
  }

  if (entry.count >= maxRequests) return false; // bloqué

  entry.count++;
  return true;
}
