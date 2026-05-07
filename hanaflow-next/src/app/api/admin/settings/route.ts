import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ok, err, validateBody } from "@/lib/apiHelpers";
import { logAudit } from "@/lib/audit";
import { invalidateSettingsCache } from "@/lib/settings";

const updateSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().trim().min(1).max(64),
      value: z.string().max(2000),
      category: z.string().trim().min(1).max(32).optional(),
    }),
  ),
});

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: [{ category: "asc" }, { key: "asc" }],
    });
    return ok({
      settings: settings.map((s) => ({
        key: s.key,
        value: s.value,
        category: s.category,
        updatedAt: s.updatedAt.toISOString(),
        updatedBy: s.updatedBy,
      })),
    });
  } catch {
    return err("Erreur serveur", 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("status" in auth) return auth;

  const body = await req.json().catch(() => null);
  const validated = validateBody(updateSchema, body);
  if (!validated.success) return err(validated.error, 400);

  try {
    const updates = validated.data.settings;
    for (const s of updates) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: {
          value: s.value,
          category: s.category ?? "general",
          updatedBy: auth.user.email,
        },
        create: {
          key: s.key,
          value: s.value,
          category: s.category ?? "general",
          updatedBy: auth.user.email,
        },
      });
    }

    invalidateSettingsCache();

    await logAudit({
      actor: auth.user,
      action: "settings.update",
      metadata: { keys: updates.map((u) => u.key) },
      req,
    });

    return ok({ message: "Paramètres mis à jour", count: updates.length });
  } catch (e) {
    console.error("[admin/settings PATCH]", e);
    return err("Erreur serveur", 500);
  }
}
