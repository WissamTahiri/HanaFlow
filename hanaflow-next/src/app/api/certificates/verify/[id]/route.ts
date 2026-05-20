import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { err, ok, rateLimit, getClientIp } from "@/lib/apiHelpers";

/**
 * GET /api/certificates/verify/[id]
 *
 * Endpoint PUBLIC — pas d'auth requise. Permet à un recruteur de vérifier
 * qu'un certificat HanaFlow est authentique en saisissant son ID.
 *
 * On retourne uniquement les infos non-sensibles : nom du candidat, module,
 * score, date d'émission, statut de révocation. AUCUNE info sur le compte
 * (email, etc.) — c'est un cert publiquement vérifiable, pas un dump.
 *
 * Rate-limited par IP pour éviter une énumération massive d'IDs (peu probable
 * avec des cuid, mais ceinture + bretelles).
 */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const ip = getClientIp(req);
  if (!(await rateLimit(`cert-verify:ip:${ip}`, 60, 60 * 60 * 1000))) {
    return err("Trop de vérifications depuis cette IP.", 429);
  }

  const { id } = await ctx.params;
  if (!id || id.length > 64) return err("Identifiant invalide", 400);

  const cert = await prisma.completionCertificate.findUnique({
    where: { id },
    select: {
      id: true,
      candidateName: true,
      moduleCode: true,
      moduleLabel: true,
      certCode: true,
      examScore: true,
      examQuestions: true,
      issuedAt: true,
      revokedAt: true,
      revokedReason: true,
    },
  });

  if (!cert) {
    return ok({ valid: false, reason: "not_found" }, 200);
  }

  if (cert.revokedAt) {
    return ok({
      valid: false,
      reason: "revoked",
      revokedAt: cert.revokedAt,
      revokedReason: cert.revokedReason,
      certificate: cert,
    });
  }

  return ok({ valid: true, certificate: cert });
}

export const dynamic = "force-dynamic";
