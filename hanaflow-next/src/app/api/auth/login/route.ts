import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signAccessToken, hashToken, getRefreshTokenExpiry } from "@/lib/auth";
import { validateBody, err, rateLimit, COOKIE_OPTIONS } from "@/lib/apiHelpers";
import { verifyTotp } from "@/lib/totp";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Mot de passe requis"),
  totpCode: z.string().trim().min(6).max(8).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`login:${ip}`)) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(loginSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const validPassword = user && (await argon2.verify(user.passwordHash, data.password));

  // Même message pour email inexistant et mauvais mot de passe (anti-énumération)
  if (!user || !validPassword) {
    return err("Identifiants invalides", 400);
  }

  if (user.isSuspended) return err("Compte suspendu. Contactez le support.", 403);

  // Étape 2FA si activée sur le compte
  if (user.totpEnabled && user.totpSecret) {
    if (!data.totpCode) {
      return NextResponse.json(
        { message: "Code 2FA requis", requires2fa: true },
        { status: 401 },
      );
    }
    if (!verifyTotp(data.totpCode, user.totpSecret)) {
      return NextResponse.json(
        { message: "Code 2FA invalide", requires2fa: true },
        { status: 401 },
      );
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

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, isPro: user.isPro, isSuspended: user.isSuspended },
    token: accessToken,
  });
  res.cookies.set("refreshToken", rawRefresh, COOKIE_OPTIONS);
  return res;
}
