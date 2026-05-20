import { NextRequest } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
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

/**
 * POST /api/interview/start
 *
 * Génère un set de 6 questions d'entretien adaptées au module + séniorité.
 * Pas de state serveur : le client garde {moduleCode, seniority, questions}
 * et les renvoie lors du POST /api/interview/grade.
 *
 * Coût : 1 appel Gemini Flash, ~1.5K tokens output → toujours sous le free tier.
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

const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      description: `Exactement ${QUESTION_COUNT} questions d'entretien, mélange de difficultés`,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER, description: "Index 1-based" },
          text: { type: Type.STRING, description: "Question posée au candidat, en français" },
          difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
          focus: {
            type: Type.STRING,
            description: "Tag court (1-3 mots) : sujet/T-code/processus couvert",
          },
          idealAnswer: {
            type: Type.STRING,
            description:
              "Réponse modèle attendue (3-6 phrases). Utilisée plus tard pour la notation, NON montrée au candidat à ce stade.",
          },
        },
        required: ["id", "text", "difficulty", "focus", "idealAnswer"],
      },
    },
  },
  required: ["questions"],
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return err("Service IA non configuré (GEMINI_API_KEY manquant).", 503);

  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  // 3 interviews / heure / user, 8 / heure / IP. Plus serré que la roadmap
  // car chaque interview = 2 appels Gemini.
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

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: geminiResponseSchema,
        temperature: 0.8,
      },
    });

    const text = response.text;
    if (!text) return err("Réponse IA vide.", 500);

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("[interview/start] JSON parse failed:", text.slice(0, 200));
      return err("Réponse IA mal formée.", 500);
    }

    const result = responseZod.safeParse(parsed);
    if (!result.success) {
      console.error("[interview/start] Zod validation failed:", result.error.issues);
      return err("Réponse IA invalide.", 500);
    }

    return ok({
      moduleCode,
      seniority,
      style,
      questions: result.data.questions,
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
      },
    });
  } catch (e) {
    console.error("[interview/start] gemini error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/quota|rate.?limit/i.test(msg)) {
      return err("Service IA temporairement saturé. Réessaie dans quelques minutes.", 429);
    }
    if (/api.?key|unauthorized|forbidden/i.test(msg)) {
      return err("Erreur d'authentification côté Google.", 500);
    }
    return err("Erreur lors de la génération des questions.", 500);
  }
}
