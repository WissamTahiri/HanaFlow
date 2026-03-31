import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/auth";
import { COOKIE_OPTIONS } from "@/lib/apiHelpers";

export async function POST(req: NextRequest) {
  const rawToken = req.cookies.get("refreshToken")?.value;
  if (rawToken) {
    await prisma.refreshToken
      .delete({ where: { tokenHash: hashToken(rawToken) } })
      .catch(() => {}); // ignore si déjà supprimé
  }

  const res = NextResponse.json({ message: "Déconnecté avec succès" });
  res.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return res;
}
