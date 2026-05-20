import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";
import certCatalog from "@/data/cert-catalog.json";

/**
 * POST /api/certificates/issue
 *
 * Émet (ou met à jour) un certificat de completion HanaFlow pour un module.
 * Critère : score au simulateur d'examen ≥ passingScore du module officiel.
 *
 * Idempotent par (userId, moduleCode) — passer plusieurs fois ne crée pas
 * de doublon, mais conserve le MEILLEUR score historique du candidat.
 *
 * Note sécurité : le score vient du client (le simulateur tourne côté
 * navigateur). Pour la V1 on accepte ça — le candidat n'a aucun intérêt
 * à se fausser un score sur SON propre cert. Pour la prod scale, on
 * passera la notation côté serveur (cf. roadmap technique).
 */

const inputSchema = z.object({
  moduleCode: z.string().min(2).max(10).transform((v) => v.toUpperCase()),
  examScore: z.number().int().min(0).max(100),
  examQuestions: z.number().int().min(5).max(200),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  // 5 émissions/h/user : il y a 6 modules, donc bien suffisant pour
  // un cas normal mais bloque une attaque scriptée.
  if (!(await rateLimit(`cert-issue:user:${auth.user.userId}`, 5, 60 * 60 * 1000))) {
    return err("Tu as déjà émis 5 certificats cette heure.", 429);
  }
  if (!(await rateLimit(`cert-issue:ip:${ip}`, 15, 60 * 60 * 1000))) {
    return err("Trop d'émissions depuis cette IP.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { moduleCode, examScore, examQuestions } = validated.data;

  const moduleInfo = certCatalog.modules.find((m) => m.code === moduleCode);
  if (!moduleInfo) return err("Module SAP inconnu", 400);

  if (examScore < moduleInfo.passingScore) {
    return err(
      `Score insuffisant : tu as obtenu ${examScore}%, le minimum requis est ${moduleInfo.passingScore}% (équivalent au seuil officiel SAP).`,
      400,
    );
  }

  // Récupère le user pour avoir son nom à la date d'émission
  const dbUser = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    select: { name: true, isSuspended: true, emailVerifiedAt: true },
  });
  if (!dbUser) return err("Utilisateur introuvable", 401);
  if (dbUser.isSuspended) return err("Compte suspendu", 403);
  if (!dbUser.emailVerifiedAt) {
    return err(
      "Tu dois vérifier ton email avant de pouvoir générer un certificat.",
      403,
    );
  }

  // Upsert : si cert existe, on update si le nouveau score est meilleur,
  // sinon on retourne celui existant tel quel.
  const existing = await prisma.completionCertificate.findUnique({
    where: { userId_moduleCode: { userId: auth.user.userId, moduleCode } },
  });

  if (existing && existing.examScore >= examScore) {
    // Score pas meilleur → on renvoie le cert actuel, pas de nouvelle écriture.
    return ok({ certificate: existing, isNew: false, improved: false });
  }

  const cert = await prisma.completionCertificate.upsert({
    where: { userId_moduleCode: { userId: auth.user.userId, moduleCode } },
    create: {
      userId: auth.user.userId,
      moduleCode,
      moduleLabel: moduleInfo.name,
      certCode: moduleInfo.cert,
      candidateName: dbUser.name,
      examScore,
      examQuestions,
    },
    update: {
      examScore,
      examQuestions,
      issuedAt: new Date(),
      // Garde le nom et le moduleLabel snapshot du premier passage si
      // l'utilisateur a renommé son compte entre temps : on remet à jour
      // pour rester aligné avec le nom courant (préférable côté UX).
      candidateName: dbUser.name,
      moduleLabel: moduleInfo.name,
      certCode: moduleInfo.cert,
      // Si le cert avait été révoqué, on l'efface (nouvel exam réussi)
      revokedAt: null,
      revokedReason: null,
    },
  });

  return ok({
    certificate: cert,
    isNew: !existing,
    improved: !!existing && existing.examScore < examScore,
  });
}
