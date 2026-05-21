import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok, validateBody } from "@/lib/apiHelpers";

const createSchema = z.object({
  authorName: z.string().min(1).max(120),
  authorRole: z.string().max(120).optional(),
  authorCompany: z.string().max(120).optional(),
  authorPhotoUrl: z.string().url().max(2000).optional(),
  authorLinkedInUrl: z.string().url().max(2000).optional(),
  quote: z.string().min(20).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

/**
 * GET /api/admin/testimonials — liste complète (publiés ou non).
 * POST /api/admin/testimonials — crée un témoignage.
 */
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const items = await prisma.testimonial.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return ok({ items });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(createSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const created = await prisma.testimonial.create({ data: validated.data });
  return ok({ testimonial: created }, 201);
}

export const dynamic = "force-dynamic";
