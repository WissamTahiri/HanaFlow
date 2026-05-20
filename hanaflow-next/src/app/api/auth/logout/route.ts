import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import {
  COOKIE_OPTIONS,
  CSRF_COOKIE_NAME,
  CSRF_COOKIE_OPTIONS,
  verifyCsrf,
  err,
} from "@/lib/apiHelpers";

export async function POST(req: NextRequest) {
  // CSRF : sans ce check, un attaquant cross-origin peut déconnecter
  // l'utilisateur sur simple navigation.
  if (!verifyCsrf(req)) return err("CSRF token manquant ou invalide", 403);

  const rawToken = req.cookies.get("refreshToken")?.value;
  if (rawToken) {
    await prisma.refreshToken
      .delete({ where: { tokenHash: hashToken(rawToken) } })
      .catch(() => {}); // ignore si déjà supprimé
  }

  const res = NextResponse.json({ message: "Déconnecté avec succès" });
  res.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.cookies.set(CSRF_COOKIE_NAME, "", { ...CSRF_COOKIE_OPTIONS, maxAge: 0 });
  return res;
}
