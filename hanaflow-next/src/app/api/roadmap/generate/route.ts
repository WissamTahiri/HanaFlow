import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
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
 * POST /api/roadmap/generate
 *
 * Génère une roadmap SAP personnalisée pour un user authentifié via Claude API.
 *
 * Entrées : profil (niveau, objectif, dispo/semaine, secteur, préférence module).
 * Sortie : roadmap structurée (modules ordonnés + milestones + nextSteps).
 *
 * Best practices Anthropic SDK :
 *  - Modèle : claude-opus-4-7 (recommandé par défaut)
 *  - Structured outputs via Zod schema + messages.parse() (sortie validée)
 *  - Prompt caching sur le system prompt (catalog stable)
 *  - Pas de thinking (tâche simple JSON, pas besoin)
 *  - Auth + double rate-limit (user + IP)
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

const moduleCodeSchema = z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]);

const roadmapSchema = z.object({
  summary: z
    .string()
    .describe("Résumé du parcours recommandé en 1-2 phrases en français"),
  estimatedTotalWeeks: z
    .number()
    .int()
    .min(1)
    .describe("Estimation totale du parcours en semaines"),
  modules: z
    .array(
      z.object({
        code: moduleCodeSchema,
        order: z.number().int().min(1).describe("Ordre dans le parcours (1, 2, 3...)"),
        weeks: z.number().int().min(1).describe("Nombre de semaines pour ce module"),
        why: z
          .string()
          .describe(
            "Explication concrète pourquoi ce module à cette position. 1-2 phrases.",
          ),
      }),
    )
    .min(1)
    .describe("Modules SAP ordonnés selon le parcours optimal pour ce profil"),
  milestones: z
    .array(
      z.object({
        week: z.number().int().min(1),
        title: z.string().describe("Titre court du milestone"),
        description: z.string().describe("Ce qui se passe à ce milestone"),
      }),
    )
    .describe("Jalons clés du parcours (3-6 milestones)"),
  nextSteps: z
    .array(z.string())
    .min(3)
    .max(6)
    .describe(
      "3-5 actions très concrètes que l'apprenant peut faire DÈS AUJOURD'HUI",
    ),
});

const MAX_TOKENS = 4000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return err(
      "Service IA non configuré (ANTHROPIC_API_KEY manquant côté serveur).",
      503,
    );
  }

  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  // Rate-limit aggressif : la génération Claude coûte ~$0.10–0.20 par appel.
  // 5 par heure par user + 10 par heure par IP = on couvre les abus.
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

  // System prompt : contient le catalog SAP. Cacheable (stable, ~1k tokens
  // par session — le cache hit kick in dès qu'on a > 1024 tokens).
  const systemPrompt = `Tu es un coach SAP expérimenté qui aide des apprenants à construire un parcours personnalisé vers un poste de consultant SAP (junior, lead, freelance, etc.).

Tu connais les modules SAP enseignés sur HanaFlow (plateforme certifiante alignée sur les certifs officielles SAP) :

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

Règles strictes pour la roadmap que tu génères :

1. **Ordre logique** : ne propose pas un module avancé avant un fondamental. FI est souvent la porte d'entrée (compta = colonne vertébrale ERP). MM précède souvent SD (input → output). CO est utile après FI. PP est plus avancé. AI est une spécialisation transverse, à placer en complément.
2. **Réalisme** : ne propose pas 6 modules sur 8 semaines à 5h/semaine. Compte ~3-4 semaines minimum par module à 5h/semaine, ~2 semaines à 10h/semaine.
3. **Concret** : dans \`why\`, dis pourquoi CE module pour CE profil. Pas de phrases passe-partout.
4. **Pas de bullshit AI** : pas de "Vous allez exceller", "incroyable opportunité", "transformer votre carrière". Phrasing direct, factuel.
5. **nextSteps actionnables** : pas "se former" ou "rester motivé". Quelque chose comme : "Commence par lire le chapitre 1 du module FI sur HanaFlow", "Passe le simulateur FI dès que tu finis les 3 premiers chapitres".

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

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.parse({
      model: "claude-opus-4-7",
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
      output_config: {
        format: zodOutputFormat(roadmapSchema),
      },
    });

    if (response.stop_reason === "refusal") {
      return err("L'assistant IA a refusé de répondre à cette requête.", 422);
    }
    if (response.stop_reason === "max_tokens") {
      return err(
        "La roadmap a été tronquée. Réessaie en simplifiant ton profil.",
        500,
      );
    }
    if (!response.parsed_output) {
      return err("Réponse IA invalide (parsing impossible).", 500);
    }

    return ok({
      roadmap: response.parsed_output,
      usage: {
        input_tokens: response.usage.input_tokens,
        cache_read: response.usage.cache_read_input_tokens ?? 0,
        cache_creation: response.usage.cache_creation_input_tokens ?? 0,
        output_tokens: response.usage.output_tokens,
      },
    });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) {
      console.error("[roadmap/generate] anthropic rate limit");
      return err("Service IA temporairement saturé, réessaie dans 1 minute.", 429);
    }
    if (e instanceof Anthropic.APIError) {
      console.error("[roadmap/generate] anthropic api error", e.status, e.message);
      return err("Erreur côté Anthropic. Réessaie dans quelques minutes.", 502);
    }
    console.error("[roadmap/generate]", e);
    return err("Erreur lors de la génération de la roadmap.", 500);
  }
}
