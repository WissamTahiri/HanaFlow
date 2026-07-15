import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok } from "@/lib/apiHelpers";

const MODULES = new Set(["FI", "CO", "MM", "SD", "PP", "AI"]);
const SENIORITIES = new Set(["junior", "confirmed", "senior"]);

/**
 * GET /api/jobs — endpoint PUBLIC. Liste les annonces publiées, non expirées.
 * Filtres optionnels : ?module=FI&seniority=junior
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const moduleCode = searchParams.get("module");
  const seniority = searchParams.get("seniority");

  const items = await prisma.jobListing.findMany({
    where: {
      isPublished: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      ...(moduleCode && MODULES.has(moduleCode) ? { moduleCode } : {}),
      ...(seniority && SENIORITIES.has(seniority) ? { seniority } : {}),
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true, title: true, companyName: true, moduleCode: true, seniority: true,
      location: true, workMode: true, contractType: true, isFeatured: true, createdAt: true,
    },
  });

  return ok({ jobs: items });
}

export const dynamic = "force-dynamic";
