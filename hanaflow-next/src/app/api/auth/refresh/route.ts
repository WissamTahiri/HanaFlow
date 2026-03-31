import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signAccessToken, hashToken, getRefreshTokenExpiry } from "@/lib/auth";
import { err, COOKIE_OPTIONS } from "@/lib/apiHelpers";

export async function POST(req: NextRequest) {
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

  // Rotation du refresh token
  await prisma.refreshToken.delete({ where: { tokenHash } });

  const { user } = stored;
  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const newRawRefresh = crypto.randomBytes(64).toString("hex");

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(newRawRefresh),
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const res = NextResponse.json({ token: accessToken, user });
  res.cookies.set("refreshToken", newRawRefresh, COOKIE_OPTIONS);
  return res;
}
