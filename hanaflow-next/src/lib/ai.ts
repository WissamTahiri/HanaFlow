import { GoogleGenAI, type Content } from "@google/genai";
import Groq from "groq-sdk";
import { z } from "zod";

/**
 * Couche d'abstraction LLM pour HanaFlow.
 *
 * Stratégie : Gemini en primary (qualité/coût), Groq Llama 3.3 70B en
 * fallback automatique sur 429 / RESOURCE_EXHAUSTED. Permet de survivre
 * aux pannes de quota gratuit Google AI Studio (`limit: 0`), qui
 * arrivent régulièrement quand le free tier d'une clé n'est pas
 * provisionné.
 *
 * Pourquoi Groq comme fallback :
 *  - Free tier ferme (30 RPM / 1000 RPD sur llama-3.3-70b-versatile)
 *  - Inférence ~10x plus rapide que Gemini Flash (matters pour le mock interview)
 *  - API OpenAI-compatible, JSON mode supporté
 *  - Pas de carte requise
 *
 * Le wrapper expose deux helpers :
 *  - generateJSON  : pour les outputs structurés (roadmap, interview)
 *  - generateText  : pour le chat libre (tuteur SAP)
 *
 * Chaque route IA NE DOIT PAS instancier GoogleGenAI ou Groq directement —
 * tout passe par ce module pour bénéficier du fallback uniformément.
 */

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash-lite";
export const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

type Provider = "gemini" | "groq";

export type AiUsage = {
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type AiError = {
  kind: "rate_limit" | "auth" | "no_provider" | "invalid_response" | "unknown";
  message: string;
  retryAfterSeconds?: number;
};

function geminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

function groqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  return apiKey ? new Groq({ apiKey }) : null;
}

/** Détecte les erreurs de rate-limit Gemini (RESOURCE_EXHAUSTED, 429). */
function isRateLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /quota|rate.?limit|RESOURCE_EXHAUSTED|429|exceeded/i.test(msg);
}

function isAuthError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /api.?key|unauthorized|forbidden|401|403|invalid.+key/i.test(msg);
}

function extractRetryAfter(err: unknown): number | undefined {
  const msg = err instanceof Error ? err.message : String(err);
  const m = msg.match(/retry in ([\d.]+)s/i);
  return m ? Math.ceil(parseFloat(m[1])) : undefined;
}

// ════════════════════════════════════════════════════════════════════
// generateJSON — output structuré (roadmap, interview start/grade)
// ════════════════════════════════════════════════════════════════════

type GeminiResponseSchema = Record<string, unknown>;

type GenerateJSONOpts<T> = {
  systemInstruction: string;
  userPrompt: string;
  /** Schéma au format Gemini (Type.OBJECT). Voir routes existantes. */
  geminiSchema: GeminiResponseSchema;
  /** Zod schema pour validation finale (s'applique aux deux providers). */
  zodSchema: z.ZodSchema<T>;
  temperature?: number;
  /** Identifiant de la route appelante (pour les logs). */
  caller: string;
};

export type GenerateJSONResult<T> = {
  data: T;
  provider: Provider;
  usage: AiUsage;
};

export async function generateJSON<T>(opts: GenerateJSONOpts<T>): Promise<GenerateJSONResult<T>> {
  const { systemInstruction, userPrompt, geminiSchema, zodSchema, temperature = 0.7, caller } = opts;

  // ── Tentative Gemini ────────────────────────────────────────────────
  const gemini = geminiClient();
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: geminiSchema,
          temperature,
        },
      });
      const text = response.text;
      if (!text) throw new Error("Gemini: empty response");
      const parsed = JSON.parse(text);
      const validated = zodSchema.safeParse(parsed);
      if (!validated.success) {
        console.error(`[ai:${caller}] gemini schema invalid:`, validated.error.issues);
        throw new Error(`Gemini response failed validation: ${validated.error.issues[0]?.message}`);
      }
      return {
        data: validated.data,
        provider: "gemini",
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
        },
      };
    } catch (err) {
      if (isRateLimit(err)) {
        console.warn(`[ai:${caller}] gemini rate-limited → fallback to groq`);
      } else if (isAuthError(err)) {
        console.warn(`[ai:${caller}] gemini auth error → fallback to groq:`, (err as Error).message);
      } else {
        console.error(`[ai:${caller}] gemini failed:`, err);
        // Pour les erreurs non rate-limit/auth, on tente quand même Groq —
        // ça couvre les pannes Gemini transient (5xx, timeouts).
      }
      // continue → Groq
    }
  }

  // ── Fallback Groq ───────────────────────────────────────────────────
  const groq = groqClient();
  if (!groq) {
    const reason = !gemini
      ? "Aucun provider IA configuré (GEMINI_API_KEY et GROQ_API_KEY manquants)"
      : "Gemini en échec et GROQ_API_KEY non configurée pour fallback";
    throw aiError("no_provider", reason);
  }

  // Pour Groq, on dérive un JSON Schema depuis Zod 4 (toJSONSchema natif)
  // et on l'injecte en system prompt. Groq comprend "response_format json_object"
  // mais ne supporte pas un schema structuré — donc on guide via prompt + Zod valide.
  let jsonSchemaDescription: string;
  try {
    const jsonSchema = z.toJSONSchema(zodSchema);
    jsonSchemaDescription = JSON.stringify(jsonSchema, null, 2);
  } catch {
    jsonSchemaDescription = "(schéma non disponible, suis la structure demandée dans le user prompt)";
  }

  const groqSystem = `${systemInstruction}

IMPORTANT — FORMAT DE RÉPONSE :
Tu DOIS répondre EXCLUSIVEMENT avec un objet JSON valide qui correspond strictement à ce JSON Schema :

\`\`\`json
${jsonSchemaDescription}
\`\`\`

Pas de markdown, pas de texte avant ou après, juste l'objet JSON brut.`;

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: groqSystem },
        { role: "user", content: userPrompt },
      ],
      temperature,
      response_format: { type: "json_object" },
      max_tokens: 4096,
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw aiError("invalid_response", "Groq: empty response");

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error(`[ai:${caller}] groq JSON parse failed:`, text.slice(0, 200));
      throw aiError("invalid_response", "Groq a renvoyé du JSON malformé");
    }

    const validated = zodSchema.safeParse(parsed);
    if (!validated.success) {
      console.error(`[ai:${caller}] groq schema invalid:`, validated.error.issues);
      throw aiError("invalid_response", `Groq response failed validation: ${validated.error.issues[0]?.message}`);
    }

    return {
      data: validated.data,
      provider: "groq",
      usage: {
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      },
    };
  } catch (err) {
    if (isAiError(err)) throw err;
    if (isRateLimit(err)) {
      throw aiError("rate_limit", "Groq aussi rate-limit. Réessaie dans quelques minutes.", extractRetryAfter(err));
    }
    if (isAuthError(err)) {
      throw aiError("auth", "Clé Groq invalide ou expirée");
    }
    console.error(`[ai:${caller}] groq failed:`, err);
    throw aiError("unknown", "Les deux providers IA sont en échec");
  }
}

// ════════════════════════════════════════════════════════════════════
// generateText — chat libre (tuteur SAP multi-turn)
// ════════════════════════════════════════════════════════════════════

type GenerateTextOpts = {
  systemInstruction: string;
  /** Format Gemini : alternance user/model. Converti automatiquement pour Groq. */
  contents: Content[];
  temperature?: number;
  maxOutputTokens?: number;
  caller: string;
};

export type GenerateTextResult = {
  text: string;
  provider: Provider;
  usage: AiUsage;
};

export async function generateText(opts: GenerateTextOpts): Promise<GenerateTextResult> {
  const { systemInstruction, contents, temperature = 0.5, maxOutputTokens = 1500, caller } = opts;

  // ── Gemini ──────────────────────────────────────────────────────────
  const gemini = geminiClient();
  if (gemini) {
    try {
      const response = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction,
          temperature,
          maxOutputTokens,
        },
      });
      const text = response.text;
      if (!text) throw new Error("Gemini: empty response");
      return {
        text,
        provider: "gemini",
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
        },
      };
    } catch (err) {
      if (isRateLimit(err)) {
        console.warn(`[ai:${caller}] gemini rate-limited → fallback to groq`);
      } else if (isAuthError(err)) {
        console.warn(`[ai:${caller}] gemini auth error → fallback to groq`);
      } else {
        console.error(`[ai:${caller}] gemini failed:`, err);
      }
    }
  }

  // ── Fallback Groq ───────────────────────────────────────────────────
  const groq = groqClient();
  if (!groq) {
    throw aiError("no_provider", !gemini
      ? "Aucun provider IA configuré"
      : "Gemini en échec et GROQ_API_KEY non configurée");
  }

  // Convertit Gemini Content[] → Groq messages[]
  // Gemini: { role: "user"|"model", parts: [{text}] }
  // Groq:   { role: "user"|"assistant", content: string }
  const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemInstruction },
    ...contents.map((c) => ({
      role: (c.role === "model" ? "assistant" : "user") as "user" | "assistant",
      content: (c.parts ?? [])
        .map((p) => ("text" in p && typeof p.text === "string" ? p.text : ""))
        .join("\n"),
    })),
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature,
      max_tokens: maxOutputTokens,
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw aiError("invalid_response", "Groq: empty response");

    return {
      text,
      provider: "groq",
      usage: {
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      },
    };
  } catch (err) {
    if (isAiError(err)) throw err;
    if (isRateLimit(err)) {
      throw aiError("rate_limit", "Groq aussi rate-limit. Réessaie dans quelques minutes.", extractRetryAfter(err));
    }
    if (isAuthError(err)) {
      throw aiError("auth", "Clé Groq invalide ou expirée");
    }
    console.error(`[ai:${caller}] groq failed:`, err);
    throw aiError("unknown", "Les deux providers IA sont en échec");
  }
}

// ════════════════════════════════════════════════════════════════════
// AiError sentinel — pour que les routes appelantes décident des HTTP codes
// ════════════════════════════════════════════════════════════════════

const AI_ERR_TAG = Symbol.for("hanaflow.AiError");

export function aiError(kind: AiError["kind"], message: string, retryAfterSeconds?: number): Error & AiError {
  const e = new Error(message) as Error & AiError;
  e.kind = kind;
  e.message = message;
  if (retryAfterSeconds !== undefined) e.retryAfterSeconds = retryAfterSeconds;
  (e as unknown as Record<symbol, boolean>)[AI_ERR_TAG] = true;
  return e;
}

export function isAiError(e: unknown): e is Error & AiError {
  return !!e && typeof e === "object" && (e as Record<symbol, boolean>)[AI_ERR_TAG] === true;
}
