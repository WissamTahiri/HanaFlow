import { NextRequest } from "next/server";
import { Type } from "@google/genai";
import { z } from "zod";
import {
  requireAuth,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";
import certCatalog from "@/data/cert-catalog.json";
import { generateJSON, isAiError } from "@/lib/ai";

/**
 * POST /api/roadmap/generate
 *
 * Génère une roadmap SAP personnalisée via Google Gemini 2.0 Flash.
 *
 * Pourquoi Gemini plutôt qu'Anthropic ici :
 *  - Free tier Google AI Studio : ~1500 req/jour gratuites
 *  - Pas de carte bancaire requise → 0€ garanti (cap à 429 si dépassement,
 *    jamais facturable)
 *  - Qualité Gemini 2.0 Flash suffisante pour du structured-JSON
 *
 * Best practices :
 *  - Auth + double rate-limit (user + IP)
 *  - Structured output via responseSchema
 *  - System instruction séparée du user prompt (convention Gemini)
 *  - Re-validation Zod côté serveur (le LLM peut déborder du schéma)
 */

const inputSchema = z.object({
  level: z.enum(["beginner", "some-knowledge", "experienced"]),
  goal: z.enum([
    "junior-consultant",
    "freelance",
    "lead-architect",
    "career-change",
    "upskill",
  ]),
  hoursPerWeek: z.number().int().min(1).max(60),
  targetIndustry: z.string().max(100).optional(),
  preferredModule: z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]).optional(),
});

// Validation côté serveur de ce que Gemini renvoie.
const roadmapResponseSchema = z.object({
  summary: z.string().min(1),
  estimatedTotalWeeks: z.number().int().min(1).max(104),
  modules: z
    .array(
      z.object({
        code: z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]),
        order: z.number().int().min(1),
        weeks: z.number().int().min(1),
        why: z.string().min(1),
      }),
    )
    .min(1)
    .max(6),
  milestones: z
    .array(
      z.object({
        week: z.number().int().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .max(8),
  nextSteps: z.array(z.string().min(1)).min(3).max(6),
});

// Schéma au format Gemini (enum Type au lieu de strings JSON).
const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Résumé du parcours en 1-2 phrases en français",
    },
    estimatedTotalWeeks: {
      type: Type.INTEGER,
      description: "Durée totale estimée du parcours en semaines",
    },
    modules: {
      type: Type.ARRAY,
      description: "Modules SAP ordonnés selon le parcours optimal",
      items: {
        type: Type.OBJECT,
        properties: {
          code: {
            type: Type.STRING,
            enum: ["FI", "CO", "MM", "SD", "PP", "AI"],
          },
          order: { type: Type.INTEGER },
          weeks: { type: Type.INTEGER },
          why: {
            type: Type.STRING,
            description: "Pourquoi ce module à cette position, 1-2 phrases",
          },
        },
        required: ["code", "order", "weeks", "why"],
      },
    },
    milestones: {
      type: Type.ARRAY,
      description: "3 à 6 jalons clés du parcours",
      items: {
        type: Type.OBJECT,
        properties: {
          week: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["week", "title", "description"],
      },
    },
    nextSteps: {
      type: Type.ARRAY,
      description: "3 à 5 actions très concrètes à faire DÈS AUJOURD'HUI",
      items: { type: Type.STRING },
    },
  },
  required: [
    "summary",
    "estimatedTotalWeeks",
    "modules",
    "milestones",
    "nextSteps",
  ],
};

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  // Rate-limit doublé : user + IP. Couvre aussi le free tier Google
  // (1500 req/jour, ~10 req/min).
  const ip = getClientIp(req);
  if (!(await rateLimit(`roadmap:user:${auth.user.userId}`, 5, 60 * 60 * 1000))) {
    return err(
      "Tu as déjà généré 5 roadmaps cette heure. Réessaie dans 1 heure.",
      429,
    );
  }
  if (!(await rateLimit(`roadmap:ip:${ip}`, 10, 60 * 60 * 1000))) {
    return err("Trop de générations depuis cette IP. Réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const profile = validated.data;

  const systemInstruction = `Tu es un coach SAP expérimenté qui aide des apprenants à construire un parcours personnalisé vers un poste de consultant SAP.

Tu connais ces modules SAP enseignés sur HanaFlow (plateforme certifiante alignée sur les certifs officielles SAP) :

${JSON.stringify(
  certCatalog.modules.map((m) => ({
    code: m.code,
    name: m.name,
    desc: m.desc,
    cert: m.cert,
    chapters: m.chapters,
    targetRoles: m.targetRoles,
  })),
  null,
  2,
)}

Règles strictes :

1. ORDRE LOGIQUE : ne propose pas un module avancé avant un fondamental. FI = porte d'entrée classique (compta = colonne vertébrale ERP). MM précède souvent SD. CO suit FI. PP est plus avancé. AI = spécialisation transverse à placer en complément.
2. RÉALISME : ne propose pas 6 modules en 8 semaines à 5h/sem. Compte minimum 3-4 semaines par module à 5h/sem, ~2 semaines à 10h/sem.
3. CONCRET : dans \`why\`, dis pourquoi CE module pour CE profil précis. Pas de phrases passe-partout.
4. ANTI-BULLSHIT : pas de "Vous allez exceller", "incroyable opportunité", "transformer votre carrière". Phrasing direct, factuel.
5. nextSteps ACTIONNABLES : pas "se former" ou "rester motivé". Plutôt : "Commence par lire le chapitre 1 du module FI sur HanaFlow", "Passe le simulateur FI dès que tu finis les 3 premiers chapitres".

Réponds en français. Tutoie l'apprenant.`;

  const userPrompt = `Voici le profil :

- **Niveau actuel** : ${
    profile.level === "beginner"
      ? "Débutant total, jamais touché SAP"
      : profile.level === "some-knowledge"
        ? "Quelques notions de base, mais rien de structuré"
        : "Déjà de l'expérience SAP (autre module, version antérieure, ou environnement client)"
  }
- **Objectif** : ${
    profile.goal === "junior-consultant"
      ? "Décrocher un premier poste de consultant SAP junior en cabinet ou ESN"
      : profile.goal === "freelance"
        ? "Me mettre à mon compte / faire du freelance"
        : profile.goal === "lead-architect"
          ? "Devenir lead consultant / architecte SAP"
          : profile.goal === "career-change"
            ? "Reconversion professionnelle complète vers SAP"
            : "Monter en compétence sur mon poste actuel"
  }
- **Disponibilité** : ${profile.hoursPerWeek} heures par semaine
${profile.targetIndustry ? `- **Secteur visé** : ${profile.targetIndustry}` : ""}
${profile.preferredModule ? `- **Module préféré (souhait initial)** : ${profile.preferredModule}` : ""}

Génère la roadmap personnalisée pour ce profil.`;

  try {
    const result = await generateJSON({
      caller: "roadmap/generate",
      systemInstruction,
      userPrompt,
      geminiSchema: geminiResponseSchema,
      zodSchema: roadmapResponseSchema,
      temperature: 0.7,
    });
    return ok({ roadmap: result.data, provider: result.provider, usage: result.usage });
  } catch (e) {
    if (isAiError(e)) {
      if (e.kind === "rate_limit") {
        const hint = e.retryAfterSeconds ? ` Réessaie dans ~${e.retryAfterSeconds}s.` : " Réessaie plus tard.";
        return err(`Service IA temporairement saturé.${hint}`, 429);
      }
      if (e.kind === "no_provider" || e.kind === "auth") return err(e.message, 503);
      if (e.kind === "invalid_response") return err("Réponse IA invalide.", 500);
    }
    console.error("[roadmap/generate] failed:", e);
    return err("Erreur lors de la génération de la roadmap.", 500);
  }
}
