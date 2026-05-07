import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err } from "@/lib/apiHelpers";
import { signImpersonationToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  if (auth.user.userId === userId) {
    return err("Inutile : vous êtes déjà connecté en tant que vous-même", 400);
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, isPro: true, isSuspended: true, createdAt: true },
    });
    if (!target) return err("Utilisateur introuvable", 404);
    if (target.isSuspended) return err("Impossible d'imiter un compte suspendu", 400);

    const token = signImpersonationToken({
      userId: target.id,
      email: target.email,
      role: target.role,
      impersonatedBy: { id: auth.user.userId, email: auth.user.email },
    });

    await logAudit({
      actor: auth.user,
      action: "user.impersonate",
      targetType: "user",
      targetId: target.id,
      metadata: { targetEmail: target.email, durationMinutes: 15 },
      req,
    });

    return ok({
      token,
      user: {
        id: target.id,
        name: target.name,
        email: target.email,
        role: target.role,
        isPro: target.isPro,
        isSuspended: target.isSuspended,
        createdAt: target.createdAt.toISOString(),
      },
      impersonatedBy: { id: auth.user.userId, email: auth.user.email },
      expiresInSeconds: 15 * 60,
    });
  } catch (e) {
    console.error("[impersonate]", e);
    return err("Erreur serveur", 500);
  }
}
