import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";

const createSchema = z.object({
  code: z.string().trim().min(3).max(50).toUpperCase(),
  description: z.string().trim().max(255).optional(),
  usageLimit: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  try {
    const codes = await prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    });
    return ok({ codes });
  } catch {
    return err("Erreur serveur", 500);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(createSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { data } = validated;

  const existing = await prisma.promoCode.findUnique({ where: { code: data.code } });
  if (existing) return err("Ce code existe déjà", 400);

  try {
    const code = await prisma.promoCode.create({
      data: {
        code: data.code,
        description: data.description,
        usageLimit: data.usageLimit,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
    await logAudit({
      actor: auth.user,
      action: "promo.create",
      targetType: "promo_code",
      targetId: code.id,
      metadata: { code: code.code },
      req,
    });
    return ok({ code }, 201);
  } catch {
    return err("Erreur serveur", 500);
  }
}
