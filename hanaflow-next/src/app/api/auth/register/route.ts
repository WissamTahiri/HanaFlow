import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signAccessToken, hashToken, getRefreshTokenExpiry } from "@/lib/auth";
import { validateBody, err, rateLimit, COOKIE_OPTIONS } from "@/lib/apiHelpers";
import { getPublicSettings } from "@/lib/settings";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100, "Nom trop long"),
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .max(255, "Email trop long")
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, "Mot de passe : 8 caractères minimum")
    .max(128, "Mot de passe trop long")
    .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export async function POST(req: NextRequest) {
  const settings = await getPublicSettings();
  if (!settings.registrationEnabled) {
    return err("Les inscriptions sont temporairement désactivées.", 403);
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`register:${ip}`)) {
    return err("Trop de tentatives, réessaie dans 15 minutes.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(registerSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return err("Email déjà utilisé", 400);

  const passwordHash = await argon2.hash(data.password, { type: argon2.argon2id });
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
    select: { id: true, name: true, email: true, role: true, isPro: true, isSuspended: true, createdAt: true },
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const rawRefresh = crypto.randomBytes(64).toString("hex");

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawRefresh),
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const res = NextResponse.json({ user, token: accessToken }, { status: 201 });
  res.cookies.set("refreshToken", rawRefresh, COOKIE_OPTIONS);
  return res;
}
