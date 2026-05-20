import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signAccessToken, hashToken, getRefreshTokenExpiry } from "@/lib/auth";
import {
  validateBody,
  err,
  rateLimit,
  COOKIE_OPTIONS,
  CSRF_COOKIE_NAME,
  CSRF_COOKIE_OPTIONS,
  generateCsrfToken,
  getClientIp,
} from "@/lib/apiHelpers";
import { verifyTotpWithStep } from "@/lib/totp";
import { decryptTotpSecret, consumeBackupCode } from "@/lib/totpCrypto";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Mot de passe requis"),
  // 6-8 chars TOTP, ou ~11 chars pour un backup code "xxxxx-xxxxx"
  totpCode: z.string().trim().min(6).max(20).optional(),
});

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`login:${ip}`))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(loginSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  // Rate-limit additionnel par email (résiste au spoofing IP)
  if (!(await rateLimit(`login:email:${data.email}`, 10, 15 * 60 * 1000))) {
    return err("Trop de tentatives sur ce compte, réessaie dans 15 minutes.", 429);
  }

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const validPassword = user && (await argon2.verify(user.passwordHash, data.password));

  // Même message pour email inexistant et mauvais mot de passe (anti-énumération)
  if (!user || !validPassword) {
    return err("Identifiants invalides", 400);
  }

  if (user.isSuspended) return err("Compte suspendu. Contactez le support.", 403);

  // Étape 2FA si activée sur le compte.
  // Si le code n'est pas fourni → message générique (pas d'énumération du fait qu'on
  // ait validé le mot de passe). Le client doit présenter un champ TOTP par défaut
  // quand l'utilisateur déclare avoir activé la 2FA, ou after un retry.
  if (user.totpEnabled && user.totpSecret) {
    if (!data.totpCode) {
      return NextResponse.json(
        { message: "Identifiants invalides", requires2fa: true },
        { status: 401 },
      );
    }

    const plainSecret = decryptTotpSecret(user.totpSecret);
    const step = verifyTotpWithStep(data.totpCode, plainSecret);

    if (step !== null) {
      // TOTP valide → vérifier qu'il n'a pas déjà été utilisé (anti-replay)
      if (user.totpLastStep !== null && step <= user.totpLastStep) {
        return NextResponse.json(
          { message: "Code 2FA déjà utilisé. Attendez 30 secondes.", requires2fa: true },
          { status: 401 },
        );
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { totpLastStep: step },
      });
    } else {
      // Pas de match TOTP → tenter comme code de récupération
      const storedCodes = Array.isArray(user.totpBackupCodes)
        ? (user.totpBackupCodes as string[])
        : null;
      const remaining = storedCodes ? consumeBackupCode(data.totpCode, storedCodes) : null;
      if (!remaining) {
        return NextResponse.json(
          { message: "Identifiants invalides", requires2fa: true },
          { status: 401 },
        );
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { totpBackupCodes: remaining },
      });
    }
  }

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const rawRefresh = crypto.randomBytes(64).toString("hex");

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawRefresh),
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const csrfToken = generateCsrfToken();
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, isPro: user.isPro, isSuspended: user.isSuspended },
    token: accessToken,
    csrfToken,
  });
  res.cookies.set("refreshToken", rawRefresh, COOKIE_OPTIONS);
  res.cookies.set(CSRF_COOKIE_NAME, csrfToken, CSRF_COOKIE_OPTIONS);
  return res;
}
