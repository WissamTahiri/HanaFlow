import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err } from "@/lib/apiHelpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) return err("Utilisateur introuvable", 404);
  return ok({ user });
}
