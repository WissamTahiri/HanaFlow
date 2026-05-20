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
 * POST /api/interview/grade
 *
 * Note un entretien entier en UN appel Gemini. Le client envoie toutes les
 * questions (avec idealAnswer issu de /start) et les réponses du candidat.
 *
 * Pourquoi noter en batch : (a) un seul appel = un seul coût, (b) Gemini peut
 * voir l'ensemble pour repérer cohérence / contradictions, (c) la verdict
 * global tient compte du parcours complet.
 *
 * idealAnswer est passé au LLM comme barème de référence. On le renvoie ensuite
 * au front qui le montre dans le rapport (révision post-entretien).
 */

const inputSchema = z.object({
  moduleCode: z.enum(["FI", "CO", "MM", "SD", "PP", "AI"]),
  seniority: z.enum(["junior", "confirmed", "senior"]),
  items: z
    .array(
      z.object({
        id: z.number().int().min(1),
        question: z.string().min(5),
        difficulty: z.enum(["easy", "medium", "hard"]),
        focus: z.string().min(1).max(120),
        idealAnswer: z.string().min(10),
        answer: z.string().max(4000),
      }),
    )
    .min(3)
    .max(10),
});

// Validation Zod du JSON renvoyé par Gemini.
const responseZod = z.object({
  perQuestion: z.array(
    z.object({
      id: z.number().int().min(1),
      score: z.number().int().min(0).max(10),
      verdict: z.enum(["correct", "partial", "incorrect", "blank"]),
      feedback: z.string().min(10),
    }),
  ),
  overall: z.object({
    score: z.number().int().min(0).max(100),
    grade: z.enum(["A", "B", "C", "D", "F"]),
    verdict: z.string().min(10),
    strengths: z.array(z.string().min(3)).min(1).max(5),
    weaknesses: z.array(z.string().min(3)).min(0).max(5),
    recommendation: z.string().min(10),
    hireability: z.enum(["hire", "borderline", "no-hire"]),
  }),
});

const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    perQuestion: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          score: { type: Type.INTEGER, description: "Note sur 10" },
          verdict: { type: Type.STRING, enum: ["correct", "partial", "incorrect", "blank"] },
          feedback: {
            type: Type.STRING,
            description:
              "2-4 phrases. Pointe les bons éléments, ce qui manque, ce qui est faux. Cite T-codes/tables manquants si pertinent.",
          },
        },
        required: ["id", "score", "verdict", "feedback"],
      },
    },
    overall: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Score global sur 100" },
        grade: { type: Type.STRING, enum: ["A", "B", "C", "D", "F"] },
        verdict: {
          type: Type.STRING,
          description: "1-2 phrases : impression générale après l'entretien",
        },
        strengths: {
          type: Type.ARRAY,
          description: "1-3 points forts concrets",
          items: { type: Type.STRING },
        },
        weaknesses: {
          type: Type.ARRAY,
          description: "0-3 axes d'amélioration concrets",
          items: { type: Type.STRING },
        },
        recommendation: {
          type: Type.STRING,
          description:
            "Action concrète à faire en priorité (chapitre HanaFlow, T-codes à pratiquer, etc.)",
        },
        hireability: {
          type: Type.STRING,
          enum: ["hire", "borderline", "no-hire"],
          description:
            "Décision de recrutement simulée pour le poste visé à cette séniorité",
        },
      },
      required: ["score", "grade", "verdict", "strengths", "weaknesses", "recommendation", "hireability"],
    },
  },
  required: ["perQuestion", "overall"],
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return err("Service IA non configuré (GEMINI_API_KEY manquant).", 503);

  const auth = requireAuth(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  if (!(await rateLimit(`itv-grade:user:${auth.user.userId}`, 5, 60 * 60 * 1000))) {
    return err("Tu as déjà noté 5 entretiens cette heure. Réessaie plus tard.", 429);
  }
  if (!(await rateLimit(`itv-grade:ip:${ip}`, 15, 60 * 60 * 1000))) {
    return err("Trop de notations depuis cette IP. Réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const { moduleCode, seniority, items } = validated.data;
  const moduleInfo = certCatalog.modules.find((m) => m.code === moduleCode);
  if (!moduleInfo) return err("Module inconnu", 400);

  const seniorityLabel = {
    junior: "junior (0-2 ans d'XP)",
    confirmed: "confirmé (3-5 ans d'XP)",
    senior: "senior/lead (6+ ans d'XP)",
  }[seniority];

  const systemInstruction = `Tu es un recruteur senior SAP qui note un entretien technique sur le module ${moduleCode} (${moduleInfo.name}) pour un poste ${seniorityLabel}.

Barème par question :
- 0/10 : réponse vide ou hors sujet total → verdict="blank"
- 1-3/10 : pas grand chose, concepts confus, T-codes inventés → verdict="incorrect"
- 4-7/10 : idée juste mais incomplet ou imprécis → verdict="partial"
- 8-10/10 : couvre les points clés du idealAnswer, T-codes/tables corrects → verdict="correct"

Score global sur 100 = moyenne pondérée par difficulté (easy ×1, medium ×1.5, hard ×2). Convertis en grade :
- A : 85-100
- B : 70-84
- C : 55-69
- D : 40-54
- F : 0-39

Décision hireability pour la séniorité ${seniority} :
- hire : niveau attendu atteint avec marge
- borderline : niveau juste suffisant, à confirmer en second entretien
- no-hire : trop d'écart avec le niveau requis

Règles STRICTES :
1. SOIS HONNÊTE : pas de note de complaisance. Une réponse vide = 0, une réponse correcte mais incomplète ne mérite pas 10.
2. FEEDBACK CONCRET : cite ce qui manque par rapport à idealAnswer (T-code, table, étape de processus). Pas de "bonne réponse globale".
3. RESPECTE LE NIVEAU ATTENDU : pour un junior, on accepte une réponse de base. Pour un senior, on attend de la profondeur.
4. RECOMMENDATION = action SAP concrète : "Révise les T-codes FBL3N/FAGLL03 et leur lien avec l'Universal Journal", "Pratique la création d'un cycle d'allocation CO en S/4HANA". Pas "améliorer ses connaissances".
5. PAS DE DRAMATISATION : "no-hire" est OK et utile, pas blessant. Reste pro.

Tutoie le candidat dans le feedback et la recommendation. Français pro.`;

  const userPrompt = `Voici l'entretien à noter (${items.length} questions). Pour chaque item, tu as : la question posée, la difficulté, la réponse modèle (idealAnswer), et la réponse du candidat.

${items
  .map(
    (it) => `--- Question ${it.id} (${it.difficulty}, focus: ${it.focus}) ---
QUESTION : ${it.question}
RÉPONSE MODÈLE : ${it.idealAnswer}
RÉPONSE DU CANDIDAT : ${it.answer.trim() || "[VIDE]"}
`,
  )
  .join("\n")}

Note chaque question selon le barème, puis donne ton verdict global.`;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: geminiResponseSchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) return err("Réponse IA vide.", 500);

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("[interview/grade] JSON parse failed:", text.slice(0, 200));
      return err("Réponse IA mal formée.", 500);
    }

    const result = responseZod.safeParse(parsed);
    if (!result.success) {
      console.error("[interview/grade] Zod validation failed:", result.error.issues);
      return err("Réponse IA invalide.", 500);
    }

    return ok({
      perQuestion: result.data.perQuestion,
      overall: result.data.overall,
      // On renvoie aussi les idealAnswers pour que le front les affiche en révision
      idealAnswers: items.map((it) => ({ id: it.id, idealAnswer: it.idealAnswer })),
      usage: {
        promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
      },
    });
  } catch (e) {
    console.error("[interview/grade] gemini error:", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (/quota|rate.?limit/i.test(msg)) {
      return err("Service IA temporairement saturé. Réessaie dans quelques minutes.", 429);
    }
    if (/api.?key|unauthorized|forbidden/i.test(msg)) {
      return err("Erreur d'authentification côté Google.", 500);
    }
    return err("Erreur lors de la notation.", 500);
  }
}
