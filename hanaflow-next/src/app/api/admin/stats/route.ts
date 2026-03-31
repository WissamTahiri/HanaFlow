import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  try {
    const [totalUsers, proUsers, suspendedUsers, totalPromoCodes, activePromoCodes] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isPro: true } }),
        prisma.user.count({ where: { isSuspended: true } }),
        prisma.promoCode.count(),
        prisma.promoCode.count({ where: { isActive: true } }),
      ]);

    return ok({ totalUsers, proUsers, suspendedUsers, totalPromoCodes, activePromoCodes });
  } catch {
    return err("Erreur serveur", 500);
  }
}
