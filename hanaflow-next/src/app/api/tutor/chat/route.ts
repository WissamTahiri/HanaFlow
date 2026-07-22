import { NextRequest } from "next/server";
import { z } from "zod";
import "server-only";
import {
  requireAuth,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";
import { isValidModule, type ModuleId } from "@/lib/certAccess";
import { generateText, isAiError, type ChatMessage } from "@/lib/ai";

/**
 * POST /api/tutor/chat
 *
 * Tuteur IA SAP : répond aux questions de l'apprenant dans le contexte d'un
 * module SAP spécifique (FI, CO, MM, SD, PP, AI). Le serveur charge le
 * contenu du module et l'injecte en system prompt — c'est un RAG basique
 * sans vector DB (le content tient largement dans le contexte).
 *
 * Multi-turn : history de la conversation passée en `contents`, ce qui permet
 * un dialogue suivi (le tuteur se souvient de la question précédente).
 *
 * Provider : Groq uniquement (voir lib/ai.ts). Rate-limit : 10 messages/user/
 * heure et 30/IP/heure.
 */

const moduleCodeSchema = z.enum(["fi", "co", "mm", "sd", "pp", "ai"]);

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().min(1).max(4000),
});

const inputSchema = z.object({
  moduleCode: moduleCodeSchema,
  chapterId: z.string().max(50).optional(),
  message: z.string().min(1).max(4000),
  history: z.array(messageSchema).max(20).optional(),
});

/** Charge dynamiquement le contenu du module et extrait un résumé pour le contexte. */
async function loadModuleContext(
  moduleCode: ModuleId,
  chapterId?: string,
): Promise<string> {
  // Import dynamique pour éviter de charger les 6 modules à chaque cold start
  const moduleData = await import(`@/data/certifications/${moduleCode}.js`);
  const cert = moduleData[`${moduleCode}Certification`];
  if (!cert) return "";

  // Sérialise une version compacte du module. Envoyer le détail complet
  // (concepts + T-codes) de TOUS les chapitres à chaque message coûte ~7000
  // tokens rien qu'en contexte (mesuré sur FI) — assez pour saturer le quota
  // Groq (tokens/minute) dès le 2e message d'une même conversation. On ne
  // détaille donc que le chapitre demandé (chapterId) ; les autres restent en
  // titres seuls. Sans chapterId, tous les chapitres restent en résumé — le
  // tuteur peut orienter l'apprenant vers le bon chapitre sans en réciter
  // tout le contenu.
  type Chapter = {
    id: string;
    title: string;
    lessons?: { id: string; title: string; keyConcepts?: { term: string; definition: string }[]; tcodes?: { code: string; description: string }[] }[];
  };
  const chapters = (cert.chapters as Chapter[]).map((ch) => {
    if (ch.id !== chapterId) {
      return { id: ch.id, title: ch.title, lessonsSummary: ch.lessons?.map((l) => l.title) ?? [] };
    }
    return {
      id: ch.id,
      title: ch.title,
      lessons: ch.lessons?.map((l) => ({
        id: l.id,
        title: l.title,
        keyConcepts: l.keyConcepts ?? [],
        tcodes: l.tcodes ?? [],
      })),
    };
  });

  return JSON.stringify(
    {
      module: cert.shortName ?? cert.name,
      code: cert.code,
      level: cert.level,
      chapters,
    },
    null,
    2,
  );
}

const MAX_OUTPUT_TOKENS = 1500;

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  if (!(await rateLimit(`tutor:user:${auth.user.userId}`, 10, 60 * 60 * 1000))) {
    return err(
      "Tu as atteint la limite de 10 messages au tuteur cette heure. Reviens dans une heure.",
      429,
    );
  }
  if (!(await rateLimit(`tutor:ip:${ip}`, 30, 60 * 60 * 1000))) {
    return err("Trop de requêtes depuis cette IP. Réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { moduleCode, chapterId, message, history } = validated.data;
  if (!isValidModule(moduleCode)) {
    return err("Module SAP inconnu", 400);
  }

  let moduleContext: string;
  try {
    moduleContext = await loadModuleContext(moduleCode, chapterId);
  } catch (e) {
    console.error("[tutor/chat] loadModuleContext failed:", e);
    return err("Impossible de charger le contenu du module.", 500);
  }

  const systemInstruction = `Tu es un tuteur SAP expert qui aide un apprenant à comprendre le module ${moduleCode.toUpperCase()}.

Tu as accès à la structure et aux concepts clés du module HanaFlow ci-dessous (titres de chapitres, leçons, concepts, T-codes officiels SAP) :

\`\`\`json
${moduleContext}
\`\`\`

Règles strictes :

1. Reste DANS LE PÉRIMÈTRE du module ${moduleCode.toUpperCase()}. Si l'apprenant pose une question hors-sujet (ex: il est dans FI et demande à propos de PP), redirige-le poliment vers le bon module HanaFlow.
2. Cite les **T-codes** quand pertinent. C'est ce qui prouve ta valeur de tuteur SAP.
3. Sois concret. Donne des exemples métier (ex: "Pour saisir une facture fournisseur, tu utilises MIRO. Voici le workflow…").
4. Pas de blabla. Pas de "Excellente question !", "Je vais vous expliquer", "N'hésitez pas à demander". Va droit au but.
5. Format : Markdown léger autorisé (gras, listes, code inline). Maximum **500 mots** par réponse. Si la question est complexe, dis "Cette question mérite plusieurs étapes, on va y aller dans l'ordre" et propose la première.
6. Si tu ne sais pas, dis-le ("Cette partie n'est pas couverte dans le module ${moduleCode.toUpperCase()} de HanaFlow") plutôt que d'inventer.
7. Tutoie l'apprenant.

Tu réponds toujours en français.`;

  const contents: ChatMessage[] = [
    ...(history ?? []).map((m) => ({ role: m.role, text: m.text })),
    { role: "user" as const, text: message },
  ];

  try {
    const result = await generateText({
      caller: "tutor/chat",
      systemInstruction,
      contents,
      temperature: 0.5,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    });
    return ok({ reply: result.text, usage: result.usage });
  } catch (e) {
    if (isAiError(e)) {
      if (e.kind === "rate_limit") {
        const hint = e.retryAfterSeconds ? ` Réessaie dans ~${e.retryAfterSeconds}s.` : " Réessaie plus tard.";
        return err(`Le tuteur est temporairement saturé.${hint}`, 429);
      }
      if (e.kind === "no_provider" || e.kind === "auth") return err(e.message, 503);
      if (e.kind === "invalid_response") return err("Le tuteur n'a pas pu répondre, réessaie.", 500);
    }
    console.error("[tutor/chat] failed:", e);
    return err("Erreur côté tuteur.", 500);
  }
}
