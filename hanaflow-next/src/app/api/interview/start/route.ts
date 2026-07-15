import { NextRequest } from "next/server";
import { z } from "zod";
import {
  requireProUser,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";
import certCatalog from "@/data/cert-catalog.json";
import { generateJSON, isAiError } from "@/lib/ai";

/**
 * POST /api/interview/start
 *
 * Génère un set de 6 questions d'entretien adaptées au module + séniorité.
 * Pas de state serveur : le client garde {moduleCode, seniority, questions}
 * et les renvoie lors du POST /api/interview/grade.
 *
 * Provider : Groq (voir lib/ai.ts).
 */

const inputSchema = z.object({
  moduleCode: z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]),
  seniority: z.enum(["junior", "confirmed", "senior"]),
  style: z.enum(["technical", "case-study", "mixed"]),
});

const QUESTION_COUNT = 6;

const responseZod = z.object({
  questions: z
    .array(
      z.object({
        id: z.number().int().min(1),
        text: z.string().min(10),
        difficulty: z.enum(["easy", "medium", "hard"]),
        focus: z.string().min(2).max(80),
        idealAnswer: z.string().min(20),
      }),
    )
    .length(QUESTION_COUNT),
});

export async function POST(req: NextRequest) {
  const auth = await requireProUser(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  // 3 interviews / heure / user, 8 / heure / IP. Plus serré que la roadmap
  // car chaque interview = 2 appels IA (start + grade).
  if (!(await rateLimit(`itv-start:user:${auth.user.userId}`, 3, 60 * 60 * 1000))) {
    return err("Tu as déjà lancé 3 entretiens cette heure. Réessaie plus tard.", 429);
  }
  if (!(await rateLimit(`itv-start:ip:${ip}`, 8, 60 * 60 * 1000))) {
    return err("Trop d'entretiens depuis cette IP. Réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { moduleCode, seniority, style } = validated.data;
  const moduleInfo = certCatalog.modules.find((m) => m.code === moduleCode);
  if (!moduleInfo) return err("Module inconnu", 400);

  const seniorityLabel = {
    junior: "junior (0-2 ans d'XP)",
    confirmed: "confirmé (3-5 ans d'XP)",
    senior: "senior/lead (6+ ans d'XP)",
  }[seniority];

  const styleLabel = {
    technical: "purement technique (T-codes, tables, paramétrage, intégration)",
    "case-study": "mises en situation client (cas concrets, comment tu gères X chez un client)",
    mixed: "mixte : moitié technique, moitié cas client",
  }[style];

  const systemInstruction = `Tu es un recruteur senior d'une ESN française spécialisée SAP qui fait passer un entretien technique à un candidat consultant SAP ${moduleCode} ${seniorityLabel}.

Module ciblé :
- Code : ${moduleInfo.code} — ${moduleInfo.name}
- Description : ${moduleInfo.desc}
- Topics clés : ${moduleInfo.topics?.join(", ")}
- Profil visé : ${moduleInfo.targetRoles?.join(", ")}
- Certification associée : ${moduleInfo.cert}

Style demandé : ${styleLabel}

Règles STRICTES pour générer les ${QUESTION_COUNT} questions :

1. PROGRESSION : commence par une question easy de mise en confiance (concept général du module), enchaîne 3 medium (T-codes, tables, intégration FI/CO/MM/SD, S/4HANA specifics), termine par 2 hard (situation complexe, troubleshooting, décision d'architecture).
2. ANCRAGE RÉEL : cite des T-codes exacts (ex. FB50, ME21N, VA01), des tables (BKPF, ACDOCA, MARA), des transactions S/4HANA, des Fiori apps.
3. NIVEAU ADAPTÉ : pour un junior, pas de questions de migration brownfield ou de SAP CAP. Pour un senior, attendre des choix d'architecture et la justification.
4. SI style=case-study : formule sous forme "Tu interviens chez un client X qui ..., comment tu fais ?". Pas de questions abstraites.
5. PAS DE QUESTIONS PIÈGES gratuites. Évalue la compétence, pas le par-cœur.
6. PAS D'INTRO type "Bienvenue, voici la question 1". Va droit au but.
7. idealAnswer = réponse modèle de 3-6 phrases, FACTUELLE, citant T-codes/tables précis. Sert à noter le candidat plus tard, donc sois précis et juste.

Tutoie le candidat. Français professionnel sans jargon RH.`;

  const userPrompt = `Génère les ${QUESTION_COUNT} questions d'entretien pour un candidat ${moduleCode} ${seniorityLabel}, style ${style}.`;

  try {
    const result = await generateJSON({
      caller: "interview/start",
      systemInstruction,
      userPrompt,
      zodSchema: responseZod,
      temperature: 0.8,
    });
    return ok({
      moduleCode,
      seniority,
      style,
      questions: result.data.questions,
      usage: result.usage,
    });
  } catch (e) {
    if (isAiError(e)) {
      if (e.kind === "rate_limit") {
        const hint = e.retryAfterSeconds ? ` Réessaie dans ~${e.retryAfterSeconds}s.` : " Réessaie plus tard.";
        return err(`Service IA temporairement saturé.${hint}`, 429);
      }
      if (e.kind === "no_provider" || e.kind === "auth") return err(e.message, 503);
      if (e.kind === "invalid_response") return err("Réponse IA invalide.", 500);
    }
    console.error("[interview/start] failed:", e);
    return err("Erreur lors de la génération des questions.", 500);
  }
}
