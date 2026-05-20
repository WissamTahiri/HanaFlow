import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, err, ok, rateLimit } from "@/lib/apiHelpers";
import { issueEmailVerification } from "@/lib/emailVerification";

/**
 * Renvoie un email de vérification au user authentifié.
 * No-op si déjà vérifié (on renvoie quand même 200 pour éviter l'énumération de statut).
 */
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  // Anti-spam : 3 emails / heure / user
  if (!(await rateLimit(`resend-verify:${auth.user.userId}`, 3, 60 * 60 * 1000))) {
    return err("Limite atteinte. Réessaie dans 1 heure.", 429);
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    select: { id: true, name: true, email: true, emailVerifiedAt: true },
  });
  if (!user) return err("Utilisateur introuvable", 404);

  if (user.emailVerifiedAt) {
    return ok({ message: "Email déjà confirmé", verified: true });
  }

  await issueEmailVerification({ id: user.id, name: user.name, email: user.email });
  return ok({ message: "Email de confirmation envoyé." });
}
