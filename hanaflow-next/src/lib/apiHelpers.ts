import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { verifyAccessToken, type JwtPayload } from "./auth";
import { prisma } from "./prisma";
import { z } from "zod";

const IS_PROD = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
  path: "/",
};

/**
 * CSRF token : double-submit cookie pattern.
 *  - cookie NON httpOnly (le JS doit pouvoir le lire pour le renvoyer en header)
 *  - SameSite=Lax (suffisant car on exige aussi le header X-CSRF-Token, qu'un
 *    attaquant cross-origin ne peut pas forger)
 *  - secure en prod
 */
export const CSRF_COOKIE_NAME = "csrfToken";
export const CSRF_HEADER_NAME = "x-csrf-token";

export const CSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: IS_PROD,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
};

export function generateCsrfToken(): string {
  // 32 bytes → 64 hex chars, suffisant pour résister à la devinette
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Vérifie qu'un endpoint cookie-only (refresh, logout) reçoit bien un header
 * X-CSRF-Token qui matche le cookie. Bloque les CSRF cross-origin (form-POST
 * top-level nav ne peut pas forger un header custom).
 *
 * Comparaison timing-safe sur des strings hex de longueur fixe.
 */
export function verifyCsrf(req: NextRequest): boolean {
  const cookieVal = req.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerVal = req.headers.get(CSRF_HEADER_NAME);
  if (!cookieVal || !headerVal) return false;
  if (cookieVal.length !== headerVal.length) return false;
  let diff = 0;
  for (let i = 0; i < cookieVal.length; i++) {
    diff |= cookieVal.charCodeAt(i) ^ headerVal.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Récupère l'IP réelle du client de manière résistante au spoofing.
 *
 * IMPORTANT : `x-real-ip` n'est PAS posé par l'edge network Vercel (c'est une
 * convention nginx/Apache, pas une garantie de la plateforme). Un client peut
 * envoyer n'importe quelle valeur dans cet en-tête et elle arrive intacte au
 * route handler — on ne doit donc jamais lui faire confiance pour du
 * rate-limiting ou de l'audit.
 *
 * Seul `x-forwarded-for` est fiable sur Vercel : l'edge network y ajoute
 * systématiquement l'IP réelle du client en dernière position de la liste
 * (les valeurs éventuellement fournies par le client sont préservées avant
 * ce dernier segment, mais ne peuvent pas l'écraser).
 */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

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

/**
 * Vérifie la fraîcheur d'un access token contre l'état actuel en DB :
 *  - compte suspendu depuis l'émission du token → rejeté
 *  - mot de passe changé après l'émission du token (pwdChangedAt > iat) → rejeté
 *  - rôle en DB différent de celui figé dans le JWT → rejeté (évite qu'un admin
 *    rétrogradé conserve ses droits jusqu'à expiration du token)
 *  - sessions révoquées manuellement par un admin après l'émission du token
 *    (sessionsRevokedAt > iat) → rejeté
 *
 * Sans ce check, changer son mot de passe, suspendre/rétrograder un compte ou
 * révoquer ses sessions ne touchait que les refresh tokens : l'access token
 * déjà émis (jusqu'à JWT_EXPIRES_IN, 1h par défaut) continuait de passer
 * requireAuth/requireAdmin.
 */
async function checkTokenFreshness(user: JwtPayload): Promise<boolean> {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { role: true, isSuspended: true, pwdChangedAt: true, sessionsRevokedAt: true },
  });
  if (!dbUser) return false;
  if (dbUser.isSuspended) return false;
  if (dbUser.role !== user.role) return false;
  const iat = typeof user.iat === "number" ? user.iat * 1000 : 0;
  if (dbUser.pwdChangedAt) {
    if (dbUser.pwdChangedAt.getTime() > iat) return false;
  }
  if (dbUser.sessionsRevokedAt) {
    if (dbUser.sessionsRevokedAt.getTime() > iat) return false;
  }
  return true;
}

export async function requireAuth(
  req: NextRequest
): Promise<{ user: JwtPayload } | NextResponse> {
  const user = getAuthUser(req);
  if (!user) return err("Non authentifié", 401);
  if (!(await checkTokenFreshness(user))) return err("Session expirée", 401);
  return { user };
}

export async function requireAdmin(
  req: NextRequest
): Promise<{ user: JwtPayload } | NextResponse> {
  const user = getAuthUser(req);
  if (!user) return err("Non authentifié", 401);
  if (user.role !== "admin") return err("Accès refusé", 403);
  // Une session impersonée ne peut pas exécuter d'actions admin
  if (user.impersonatedBy) return err("Action admin interdite en mode impersonation", 403);
  if (!(await checkTokenFreshness(user))) return err("Session expirée", 401);
  return { user };
}

/**
 * Gate pour les features Pro (mock interview, CV builder, flashcards).
 *
 * isPro n'est pas dans le JWT (la donnée bouge — refund, upgrade, downgrade
 * doivent prendre effet immédiatement, pas à la prochaine rotation 1h plus
 * tard). On query donc la DB à chaque appel — coût négligeable (~5ms) et
 * c'est la seule manière de garantir la fraîcheur de l'état d'abonnement.
 *
 * Les admins bypassent automatiquement le gate (besoin de QA en prod).
 */
export async function requireProUser(
  req: NextRequest
): Promise<{ user: JwtPayload } | NextResponse> {
  const user = getAuthUser(req);
  if (!user) return err("Non authentifié", 401);
  if (!(await checkTokenFreshness(user))) return err("Session expirée", 401);
  if (user.role === "admin") return { user };

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { isPro: true, isSuspended: true },
  });
  if (!dbUser) return err("Utilisateur introuvable", 401);
  if (dbUser.isSuspended) return err("Compte suspendu", 403);
  if (!dbUser.isPro) {
    return err("Cette fonctionnalité est réservée aux membres Pro.", 402);
  }
  return { user };
}

/**
 * Gate pour les routes de gestion d'équipe (/api/team/*). Comme isPro,
 * l'appartenance à une organisation n'est pas dans le JWT (peut changer entre
 * deux rotations de token) — on requête la DB à chaque appel. Retourne aussi
 * l'organizationId pour éviter un second aller-retour DB côté appelant.
 */
export async function requireOrgOwner(
  req: NextRequest
): Promise<{ user: JwtPayload; organizationId: number } | NextResponse> {
  const user = getAuthUser(req);
  if (!user) return err("Non authentifié", 401);
  if (!(await checkTokenFreshness(user))) return err("Session expirée", 401);

  const membership = await prisma.organizationMember.findUnique({
    where: { userId: user.userId },
    select: { organizationId: true, role: true },
  });
  if (!membership || membership.role !== "owner") {
    return err("Réservé au propriétaire d'une équipe.", 403);
  }
  return { user, organizationId: membership.organizationId };
}

/**
 * Vérifie le mot de passe de l'admin courant — utilisé comme « step-up auth »
 * pour les opérations destructives (delete, impersonate, reset password, bulk delete).
 * Le mot de passe est passé dans le header `X-Confirm-Password` (jamais dans le body
 * pour éviter qu'il apparaisse dans des logs de request body).
 */
export async function verifyAdminPassword(req: NextRequest, userId: number): Promise<boolean> {
  const password = req.headers.get("x-confirm-password");
  if (!password) return false;
  try {
    const user = (await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    })) as { passwordHash: string } | null;
    if (!user) return false;
    return await argon2.verify(user.passwordHash, password);
  } catch {
    return false;
  }
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Backend : Upstash Redis (REST) si configuré (via l'intégration Vercel
// Marketplace qui pose KV_REST_API_* ou via les vars Upstash legacy), sinon
// fallback en mémoire (utile en dev mais ineffectif sur Vercel serverless car
// chaque Lambda a sa propre Map).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Vercel Marketplace → KV_REST_API_*  ; install manuel Upstash → UPSTASH_REDIS_REST_*
const UPSTASH_URL =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

async function redisRateLimit(key: string, maxRequests: number, windowMs: number): Promise<boolean> {
  const ttlSeconds = Math.ceil(windowMs / 1000);
  const redisKey = `rl:${key}`;
  try {
    // Pipeline : INCR puis EXPIRE NX (set TTL uniquement si la clé n'en a pas)
    const res = await fetch(`${UPSTASH_URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", redisKey],
        ["EXPIRE", redisKey, String(ttlSeconds), "NX"],
      ]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) {
      // Si Redis ne répond pas, on laisse passer (fail-open) plutôt que de bloquer
      // tout le service. Vercel WAF doit prendre le relais en prod.
      return true;
    }
    const data = (await res.json()) as Array<{ result: number | string }>;
    const count = typeof data[0]?.result === "number" ? data[0].result : parseInt(String(data[0]?.result), 10);
    return Number.isFinite(count) && count <= maxRequests;
  } catch {
    return true; // fail-open
  }
}

// Purge périodique des entrées expirées : sans ça, `rateLimitMap` grossit
// indéfiniment sur un process long-lived (self-hosted / next start) puisque
// des clés influencées par l'attaquant (ex: `forgot:email:<email>`) ne sont
// jamais relues après expiration si l'attaquant ne les réutilise pas.
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastRateLimitCleanup = Date.now();

function cleanupRateLimitMap(now: number): void {
  if (now - lastRateLimitCleanup < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;
  lastRateLimitCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (entry.resetAt < now) rateLimitMap.delete(key);
  }
}

function memoryRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupRateLimitMap(now);
  const entry = rateLimitMap.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export async function rateLimit(
  key: string,
  maxRequests = 15,
  windowMs = 15 * 60 * 1000,
): Promise<boolean> {
  if (USE_REDIS) return redisRateLimit(key, maxRequests, windowMs);
  return memoryRateLimit(key, maxRequests, windowMs);
}
