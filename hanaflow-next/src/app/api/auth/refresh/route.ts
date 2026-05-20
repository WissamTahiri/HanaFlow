import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signAccessToken, hashToken, getRefreshTokenExpiry } from "@/lib/auth";
import {
  err,
  COOKIE_OPTIONS,
  CSRF_COOKIE_NAME,
  CSRF_COOKIE_OPTIONS,
  generateCsrfToken,
  verifyCsrf,
  rateLimit,
  getClientIp,
} from "@/lib/apiHelpers";

export async function POST(req: NextRequest) {
  // Anti-DoS : un refresh légitime arrive ~1×/55min. 60 essais / IP / 5 min couvre
  // largement les cas multi-onglets et bloque les abus.
  const ip = getClientIp(req);
  if (!(await rateLimit(`refresh:${ip}`, 60, 5 * 60 * 1000))) {
    return err("Trop de requêtes", 429);
  }

  // CSRF : ce endpoint est cookie-only → un attaquant cross-origin qui
  // déclenche un form-POST top-level enverrait le cookie sans le header.
  if (!verifyCsrf(req)) return err("CSRF token manquant ou invalide", 403);

  const rawToken = req.cookies.get("refreshToken")?.value;
  if (!rawToken) return err("Refresh token manquant", 401);

  const tokenHash = hashToken(rawToken);

  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash, expiresAt: { gt: new Date() } },
    include: { user: { select: { id: true, name: true, email: true, role: true, isPro: true, isSuspended: true } } },
  });

  if (!stored) {
    const res = err("Refresh token invalide ou expiré", 401);
    res.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return res;
  }

  if (stored.user.isSuspended) {
    // Couper la session immédiatement pour les comptes suspendus
    await prisma.refreshToken.deleteMany({ where: { userId: stored.user.id } });
    const res = err("Compte suspendu", 403);
    res.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return res;
  }

  const { user } = stored;
  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const newRawRefresh = crypto.randomBytes(64).toString("hex");

  // Rotation atomique : delete + create dans une seule transaction.
  // Si 2 requêtes refresh arrivent en parallèle, une seule réussira le delete
  // (l'autre lèvera P2025 → renvoyée comme 401 invalide).
  try {
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { tokenHash } }),
      prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(newRawRefresh),
          expiresAt: getRefreshTokenExpiry(),
        },
      }),
    ]);
  } catch {
    // Une autre requête a déjà fait la rotation → traité comme invalide
    const res = err("Refresh token invalide ou expiré", 401);
    res.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
    return res;
  }

  const newCsrfToken = generateCsrfToken();
  const res = NextResponse.json({ token: accessToken, user, csrfToken: newCsrfToken });
  res.cookies.set("refreshToken", newRawRefresh, COOKIE_OPTIONS);
  res.cookies.set(CSRF_COOKIE_NAME, newCsrfToken, CSRF_COOKIE_OPTIONS);
  return res;
}
