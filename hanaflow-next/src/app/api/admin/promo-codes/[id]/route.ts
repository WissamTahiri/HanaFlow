import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  description: z.string().trim().max(255).optional(),
  usageLimit: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const codeId = parseInt(id);
  if (isNaN(codeId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const { expiresAt, ...rest } = validated.data;
    const code = await prisma.promoCode.update({
      where: { id: codeId },
      data: {
        ...rest,
        ...(expiresAt !== undefined ? { expiresAt: expiresAt ? new Date(expiresAt) : null } : {}),
      },
    });
    return ok({ code });
  } catch {
    return err("Code introuvable", 404);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await params;
  const codeId = parseInt(id);
  if (isNaN(codeId)) return err("ID invalide", 400);

  try {
    await prisma.promoCode.delete({ where: { id: codeId } });
    return ok({ message: "Code supprimé" });
  } catch {
    return err("Code introuvable", 404);
  }
}
