import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok, validateBody } from "@/lib/apiHelpers";

const patchSchema = z.object({
  authorName: z.string().min(1).max(120).optional(),
  authorRole: z.string().max(120).nullable().optional(),
  authorCompany: z.string().max(120).nullable().optional(),
  authorPhotoUrl: z.string().url().max(2000).nullable().optional(),
  authorLinkedInUrl: z.string().url().max(2000).nullable().optional(),
  quote: z.string().min(20).max(2000).optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const tId = parseInt(id, 10);
  if (!Number.isFinite(tId)) return err("ID invalide", 400);

  const body = await req.json().catch(() => null);
  const validated = validateBody(patchSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const updated = await prisma.testimonial.update({
    where: { id: tId },
    data: validated.data,
  });
  return ok({ testimonial: updated });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const { id } = await ctx.params;
  const tId = parseInt(id, 10);
  if (!Number.isFinite(tId)) return err("ID invalide", 400);

  await prisma.testimonial.delete({ where: { id: tId } });
  return ok({ message: "Témoignage supprimé" });
}
