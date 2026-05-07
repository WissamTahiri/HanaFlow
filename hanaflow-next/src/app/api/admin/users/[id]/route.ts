import { NextRequest } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const patchSchema = z.object({
  isPro: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  role: z.enum(["student", "admin"]).optional(),
  password: z.string().min(8, "Mot de passe : 8 caractères minimum").optional(),
  name: z.string().trim().min(1).max(100).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isPro: true,
        isSuspended: true,
        createdAt: true,
        progress: {
          select: { module: true, visitedAt: true },
          orderBy: { visitedAt: "desc" },
        },
        _count: {
          select: { refreshTokens: true },
        },
      },
    });

    if (!user) return err("Utilisateur introuvable", 404);

    return ok({ user });
  } catch {
    return err("Erreur serveur", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { password, ...rest } = validated.data;
  const data: Record<string, unknown> = { ...rest };
  if (password) {
    data.passwordHash = await argon2.hash(password);
  }

  if (Object.keys(data).length === 0) {
    return err("Aucun champ à mettre à jour", 400);
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, role: true, isPro: true, isSuspended: true, createdAt: true },
    });

    if (password) {
      // Invalider toutes les sessions existantes après reset
      await prisma.refreshToken.deleteMany({ where: { userId } });
    }

    await logAudit({
      actor: auth.user,
      action: password ? "user.password_reset" : "user.update",
      targetType: "user",
      targetId: userId,
      metadata: { changes: Object.keys(rest), passwordReset: Boolean(password) },
      req,
    });

    return ok({ user, passwordReset: Boolean(password) });
  } catch {
    return err("Utilisateur introuvable", 404);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  if (auth.user.userId === userId) return err("Impossible de supprimer son propre compte", 400);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
    await prisma.user.delete({ where: { id: userId } });
    await logAudit({
      actor: auth.user,
      action: "user.delete",
      targetType: "user",
      targetId: userId,
      metadata: { email: user?.email, name: user?.name },
      req,
    });
    return ok({ message: "Utilisateur supprimé" });
  } catch {
    return err("Utilisateur introuvable", 404);
  }
}
