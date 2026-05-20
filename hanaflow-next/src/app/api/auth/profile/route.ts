import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  validateBody,
  ok,
  err,
  rateLimit,
  getClientIp,
  COOKIE_OPTIONS,
} from "@/lib/apiHelpers";
import { checkPasswordBreached } from "@/lib/passwordBreach";
import {
  signAccessToken,
  hashToken,
  getRefreshTokenExpiry,
} from "@/lib/auth";
import { verifyTotp } from "@/lib/totp";
import { decryptTotpSecret } from "@/lib/totpCrypto";

/**
 * PATCH /api/auth/profile
 *  - name : modifiable librement (auth simple)
 *  - password : exige `currentPassword` + (si 2FA activée) `totpCode`
 *               révoque toutes les autres sessions et rote la session courante.
 *
 * Cette séparation existe pour éviter qu'un access token volé (XSS, etc.)
 * permette une prise de contrôle complète du compte via simple PATCH name.
 */
const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/[a-zA-Z]/)
      .regex(/[0-9]/)
      .optional(),
    currentPassword: z.string().min(1).max(128).optional(),
    totpCode: z.string().trim().min(6).max(8).optional(),
  })
  .refine((d) => d.name || d.password, { message: "Rien à mettre à jour" });

export async function PATCH(req: NextRequest) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`profile:${ip}`, 10, 15 * 60 * 1000))) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }

  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(profileSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  // Pour changer le mot de passe → on exige le mot de passe actuel
  // (et le code 2FA si activé). Pas de bypass via token volé.
  if (data.password) {
    if (!data.currentPassword) {
      return err("Mot de passe actuel requis", 401);
    }

    const current = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { passwordHash: true, totpEnabled: true, totpSecret: true },
    });
    if (!current) return err("Utilisateur introuvable", 404);

    const valid = await argon2.verify(current.passwordHash, data.currentPassword);
    if (!valid) {
      // Anti-bruteforce : sub-rate-limit par user, fail rapide
      await rateLimit(`profile-pwd:${auth.user.userId}`, 5, 15 * 60 * 1000);
      return err("Mot de passe actuel incorrect", 401);
    }

    if (current.totpEnabled && current.totpSecret) {
      const plainSecret = decryptTotpSecret(current.totpSecret);
      if (!data.totpCode || !verifyTotp(data.totpCode, plainSecret)) {
        return err("Code 2FA invalide", 401);
      }
    }

    // Refus si le nouveau pwd est connu compromis
    const breachCheck = await checkPasswordBreached(data.password);
    if (breachCheck.breached) {
      return err(
        `Ce mot de passe figure dans une fuite connue (${breachCheck.count} occurrences). Choisis-en un autre.`,
        400,
      );
    }
  }

  const updates: { name?: string; passwordHash?: string } = {};
  if (data.name) updates.name = data.name;
  if (data.password) {
    updates.passwordHash = await argon2.hash(data.password, { type: argon2.argon2id });
  }

  const user = await prisma.user.update({
    where: { id: auth.user.userId },
    data: updates,
    select: { id: true, name: true, email: true, role: true, isPro: true, isSuspended: true, createdAt: true },
  });

  // Si changement de mot de passe : invalider TOUTES les sessions actives,
  // puis émettre une nouvelle session (cookie + access token) pour l'appelant
  // afin qu'il reste connecté.
  if (data.password) {
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    const rawRefresh = crypto.randomBytes(64).toString("hex");
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawRefresh),
        expiresAt: getRefreshTokenExpiry(),
      },
    });
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    const res = NextResponse.json({ user, token: accessToken, rotated: true });
    res.cookies.set("refreshToken", rawRefresh, COOKIE_OPTIONS);
    return res;
  }

  return ok({ user });
}
