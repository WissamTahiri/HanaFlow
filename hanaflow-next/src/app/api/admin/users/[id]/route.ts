import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";

const patchSchema = z.object({
  isPro: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  role: z.enum(["student", "admin"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: validated.data,
      select: { id: true, name: true, email: true, role: true, isPro: true, isSuspended: true, createdAt: true },
    });
    return ok({ user });
  } catch {
    return err("Utilisateur introuvable", 404);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) return err("ID invalide", 400);

  // Un admin ne peut pas se supprimer lui-même
  if (auth.user.userId === userId) return err("Impossible de supprimer son propre compte", 400);

  try {
    await prisma.user.delete({ where: { id: userId } });
    return ok({ message: "Utilisateur supprimé" });
  } catch {
    return err("Utilisateur introuvable", 404);
  }
}
