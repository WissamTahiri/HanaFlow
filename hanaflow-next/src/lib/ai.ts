import Groq from "groq-sdk";
import { z } from "zod";

/**
 * Couche d'abstraction LLM pour HanaFlow.
 *
 * Provider unique : Groq (`openai/gpt-oss-120b` par défaut, surchargeable via
 * GROQ_MODEL). Gemini a été retiré (2026-07-15) — le double-provider
 * primary/fallback créait des pannes silencieuses du tuteur difficiles à
 * diagnostiquer (quota Gemini épuisé sans bascule fiable). Un seul provider,
 * bien monitoré, est plus simple à opérer correctement.
 *
 * Le wrapper expose deux helpers :
 *  - generateJSON  : pour les outputs structurés (roadmap, interview)
 *  - generateText  : pour le chat libre (tuteur SAP)
 *
 * Chaque route IA NE DOIT PAS instancier Groq directement — tout passe par
 * ce module pour bénéficier de la gestion d'erreurs uniforme.
 */

export const GROQ_MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";

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

function groqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  return apiKey ? new Groq({ apiKey }) : null;
}

function isRateLimit(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /quota|rate.?limit|429|exceeded/i.test(msg);
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
// generateJSON — output structuré (roadmap, interview start/grade, CV)
// ════════════════════════════════════════════════════════════════════

type GenerateJSONOpts<T> = {
  systemInstruction: string;
  userPrompt: string;
  /** Zod schema — sert à la fois de validation finale et de JSON Schema injecté au prompt. */
  zodSchema: z.ZodSchema<T>;
  temperature?: number;
  /** Plafond de tokens de sortie (borne le coût). Défaut 4096. */
  maxOutputTokens?: number;
  /** Identifiant de la route appelante (pour les logs). */
  caller: string;
};

export type GenerateJSONResult<T> = {
  data: T;
  usage: AiUsage;
};

export async function generateJSON<T>(opts: GenerateJSONOpts<T>): Promise<GenerateJSONResult<T>> {
  const { systemInstruction, userPrompt, zodSchema, temperature = 0.7, maxOutputTokens = 4096, caller } = opts;

  const groq = groqClient();
  if (!groq) {
    throw aiError("no_provider", "Aucun provider IA configuré (GROQ_API_KEY manquante)");
  }

  // Groq comprend "response_format json_object" mais ne supporte pas un schema
  // structuré natif — on guide via un JSON Schema dérivé de Zod, injecté dans
  // le system prompt, puis on valide strictement la réponse avec ce même schema.
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
      max_tokens: maxOutputTokens,
      // gpt-oss-120b est un modèle de raisonnement : sans ce paramètre, il peut
      // consommer tout maxOutputTokens en raisonnement interne et renvoyer un
      // `content` vide (finish_reason="length") avant même d'écrire la réponse.
      // "low" suffit largement pour du JSON structuré factuel.
      reasoning_effort: "low",
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
      usage: {
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      },
    };
  } catch (err) {
    if (isAiError(err)) throw err;
    if (isRateLimit(err)) {
      throw aiError("rate_limit", "Le service IA est saturé. Réessaie dans quelques minutes.", extractRetryAfter(err));
    }
    if (isAuthError(err)) {
      throw aiError("auth", "Clé Groq invalide ou expirée");
    }
    console.error(`[ai:${caller}] groq failed:`, err);
    throw aiError("unknown", "Le service IA est en échec");
  }
}

// ════════════════════════════════════════════════════════════════════
// generateText — chat libre (tuteur SAP multi-turn)
// ════════════════════════════════════════════════════════════════════

export type ChatMessage = { role: "user" | "model"; text: string };

type GenerateTextOpts = {
  systemInstruction: string;
  /** Historique de conversation, alternance user/model. */
  contents: ChatMessage[];
  temperature?: number;
  maxOutputTokens?: number;
  caller: string;
};

export type GenerateTextResult = {
  text: string;
  usage: AiUsage;
};

export async function generateText(opts: GenerateTextOpts): Promise<GenerateTextResult> {
  const { systemInstruction, contents, temperature = 0.5, maxOutputTokens = 1500, caller } = opts;

  const groq = groqClient();
  if (!groq) {
    throw aiError("no_provider", "Aucun provider IA configuré (GROQ_API_KEY manquante)");
  }

  const groqMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemInstruction },
    ...contents.map((c) => ({
      role: (c.role === "model" ? "assistant" : "user") as "user" | "assistant",
      content: c.text,
    })),
  ];

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature,
      max_tokens: maxOutputTokens,
      // Voir generateJSON : évite qu'une réponse de chat soit vidée par le
      // raisonnement interne du modèle avant d'atteindre le texte visible.
      reasoning_effort: "low",
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw aiError("invalid_response", "Groq: empty response");

    return {
      text,
      usage: {
        promptTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
        totalTokens: completion.usage?.total_tokens ?? 0,
      },
    };
  } catch (err) {
    if (isAiError(err)) throw err;
    if (isRateLimit(err)) {
      throw aiError("rate_limit", "Le service IA est saturé. Réessaie dans quelques minutes.", extractRetryAfter(err));
    }
    if (isAuthError(err)) {
      throw aiError("auth", "Clé Groq invalide ou expirée");
    }
    console.error(`[ai:${caller}] groq failed:`, err);
    throw aiError("unknown", "Le service IA est en échec");
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
