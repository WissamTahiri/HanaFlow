import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, err, ok, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const createSchema = z.object({
  title: z.string().min(3).max(150),
  companyName: z.string().max(150).optional(),
  moduleCode: z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]).optional(),
  seniority: z.enum(["junior", "confirmed", "senior"]).optional(),
  location: z.string().max(120).optional(),
  workMode: z.enum(["remote", "hybrid", "onsite"]).optional(),
  contractType: z.enum(["cdi", "cdd", "freelance"]).optional(),
  description: z.string().min(20).max(5000),
  externalUrl: z.string().url().max(2000).optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  expiresAt: z.string().datetime().optional(),
});

/**
 * GET /api/admin/jobs — liste complète (publiées ou non), avec compteur de candidatures.
 * POST /api/admin/jobs — crée une annonce (source="admin" — saisie manuelle).
 */
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const items = await prisma.jobListing.findMany({
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { applications: true } } },
  });
  return ok({ items });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(createSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { expiresAt, ...rest } = validated.data;

  const created = await prisma.jobListing.create({
    data: { ...rest, expiresAt: expiresAt ? new Date(expiresAt) : undefined },
  });

  await logAudit({
    actor: auth.user,
    action: "job.create",
    targetType: "job_listing",
    targetId: created.id,
    metadata: { title: created.title },
    req,
  });

  return ok({ job: created }, 201);
}

export const dynamic = "force-dynamic";
