import { NextRequest } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody, verifyAdminPassword } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";
import { sendEmail, templates } from "@/lib/email";

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

  // Step-up auth : reset de mot de passe ou changement de rôle exigent
  // que l'admin reconfirme son propre mot de passe (header X-Confirm-Password).
  const requiresStepUp = Boolean(password) || rest.role !== undefined;
  if (requiresStepUp) {
    const ok = await verifyAdminPassword(req, auth.user.userId);
    if (!ok) return err("Re-saisie du mot de passe administrateur requise", 401);
  }

  const data: Record<string, unknown> = { ...rest };
  if (password) {
    data.passwordHash = await argon2.hash(password, { type: argon2.argon2id });
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

    // Tout changement sensible invalide les sessions actives :
    //   - reset mot de passe (sinon l'ancien mdp reste utilisable via access token vivant)
    //   - suspension (sinon l'access token tient jusqu'à 1h après suspension)
    //   - changement de rôle (sinon l'access token conserve l'ancien rôle)
    const shouldRevokeSessions =
      Boolean(password) ||
      rest.isSuspended === true ||
      rest.role !== undefined;
    if (shouldRevokeSessions) {
      await prisma.refreshToken.deleteMany({ where: { userId } });
    }

    if (password) {
      const tpl = templates.passwordReset(user.name);
      void sendEmail({ to: user.email, ...tpl });
    }
    if (rest.isSuspended === true) {
      const tpl = templates.accountSuspended(user.name);
      void sendEmail({ to: user.email, ...tpl });
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

  // Step-up auth obligatoire pour les suppressions
  const stepUpOk = await verifyAdminPassword(req, auth.user.userId);
  if (!stepUpOk) return err("Re-saisie du mot de passe administrateur requise", 401);

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
