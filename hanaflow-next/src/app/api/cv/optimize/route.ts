import { NextRequest } from "next/server";
import { Type } from "@google/genai";
import { z } from "zod";
import {
  requireProUser,
  rateLimit,
  getClientIp,
  err,
  ok,
  validateBody,
} from "@/lib/apiHelpers";
import { generateJSON, isAiError } from "@/lib/ai";

/**
 * POST /api/cv/optimize
 *
 * Reçoit un CV brut (ce que l'utilisateur a saisi dans le wizard) et le
 * renvoie réécrit pour passer les filtres ATS des cabinets de recrutement
 * SAP : action verbs, quantification, vocabulaire SAP officiel (T-codes,
 * modules, certifs), structure JD-friendly.
 *
 * Pourquoi ATS : 75% des grandes ESN françaises filtrent les CV en automatique
 * (Taleo, Workday, iCIMS). Un CV mal structuré ou pauvre en keywords SAP est
 * rejeté avant qu'un humain ne le voie.
 */

// ── Input : ce que l'utilisateur a saisi (peut être imparfait) ─────────
const experienceInput = z.object({
  title: z.string().min(1).max(120),
  company: z.string().min(1).max(120),
  location: z.string().max(80).optional(),
  startDate: z.string().max(20),
  endDate: z.string().max(20).optional(),
  current: z.boolean().optional(),
  description: z.string().max(2000), // bloc texte brut, l'IA fera des bullets
});

const educationInput = z.object({
  degree: z.string().min(1).max(160),
  school: z.string().min(1).max(160),
  location: z.string().max(80).optional(),
  startDate: z.string().max(20).optional(),
  endDate: z.string().max(20).optional(),
});

const certificationInput = z.object({
  name: z.string().min(1).max(160),
  code: z.string().max(40).optional(),
  year: z.string().max(8).optional(),
  issuer: z.string().max(80).optional(),
});

const inputSchema = z.object({
  identity: z.object({
    name: z.string().min(1).max(120),
    title: z.string().min(1).max(160),
    email: z.string().email().max(160),
    phone: z.string().max(40).optional(),
    location: z.string().max(120).optional(),
    linkedin: z.string().max(200).optional(),
  }),
  targetRole: z.string().min(1).max(160), // poste/rôle visé — input critique pour l'optim ATS
  yearsExperience: z.number().int().min(0).max(50),
  summary: z.string().max(800).optional(), // peut être vide → l'IA le génère
  experiences: z.array(experienceInput).max(15).default([]),
  education: z.array(educationInput).max(8).default([]),
  skillsRaw: z.string().max(2000).default(""), // l'utilisateur saisit en vrac, l'IA catégorise
  certifications: z.array(certificationInput).max(15).default([]),
  languages: z
    .array(
      z.object({
        name: z.string().min(1).max(40),
        level: z.string().min(1).max(40), // ex "Courant", "C1", "Maternelle"
      }),
    )
    .max(8)
    .default([]),
});

// ── Output : CV optimisé, prêt pour PDF/preview ─────────────────────────
const experienceOut = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  bullets: z.array(z.string().min(8).max(280)).min(2).max(6),
});

const responseZod = z.object({
  identity: z.object({
    name: z.string(),
    title: z.string(), // peut être amélioré par l'IA
    email: z.string(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  summary: z.string().min(40).max(600), // toujours présent, l'IA le génère si manquant
  experiences: z.array(experienceOut),
  education: z.array(
    z.object({
      degree: z.string(),
      school: z.string(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  ),
  skills: z.object({
    sap: z.array(z.string()).default([]), // modules, T-codes, S/4HANA
    technical: z.array(z.string()).default([]), // ABAP, SQL, Fiori, etc.
    methods: z.array(z.string()).default([]), // Agile, ITIL, etc.
    soft: z.array(z.string()).default([]),
  }),
  certifications: z.array(
    z.object({
      name: z.string(),
      code: z.string().optional(),
      year: z.string().optional(),
      issuer: z.string().optional(),
    }),
  ),
  languages: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
    }),
  ),
  atsTips: z.array(z.string().min(5).max(280)).min(2).max(6), // feedback à afficher dans l'UI
  atsScore: z.number().int().min(0).max(100), // score de "ATS-readiness"
});

const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    identity: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        title: {
          type: Type.STRING,
          description: "Titre/poste actuel — peut être reformulé pour matcher le targetRole",
        },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        location: { type: Type.STRING },
        linkedin: { type: Type.STRING },
      },
      required: ["name", "title", "email"],
    },
    summary: {
      type: Type.STRING,
      description:
        "3-5 phrases. Inclut années d'XP, modules SAP maîtrisés, secteur, valeur ajoutée chiffrée. Reformulé pour matcher le targetRole. PAS de 'passionné, dynamique, motivé'.",
    },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          bullets: {
            type: Type.ARRAY,
            description:
              "3-5 bullets factuels. Format ATS : ACTION VERB + tâche + résultat chiffré + tech SAP. Ex: 'Configuré le module FI sur S/4HANA Cloud pour 12 sociétés (FB50, F-02, FBL3N), réduisant la clôture mensuelle de 8 à 3 jours.'",
            items: { type: Type.STRING },
          },
        },
        required: ["title", "company", "startDate", "bullets"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          school: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
        },
        required: ["degree", "school"],
      },
    },
    skills: {
      type: Type.OBJECT,
      description: "Skills catégorisés en 4 buckets pour faciliter le parsing ATS",
      properties: {
        sap: {
          type: Type.ARRAY,
          description:
            "Modules SAP, T-codes, technos SAP officielles : FI, CO, MM, SD, PP, HCM, S/4HANA, ACDOCA, Fiori, BTP, ABAP, BW/4HANA, Joule…",
          items: { type: Type.STRING },
        },
        technical: {
          type: Type.ARRAY,
          description: "Hors SAP : SQL, Python, REST, Excel avancé, Power BI…",
          items: { type: Type.STRING },
        },
        methods: {
          type: Type.ARRAY,
          description: "Méthodologies : Agile, SAP Activate, ITIL, PRINCE2…",
          items: { type: Type.STRING },
        },
        soft: {
          type: Type.ARRAY,
          description:
            "Soft skills CONCRÈTES : 'Animation atelier client', 'Reporting comité de pilotage', 'Coaching consultants juniors'. PAS 'rigoureux, organisé'.",
          items: { type: Type.STRING },
        },
      },
      required: ["sap", "technical", "methods", "soft"],
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          code: {
            type: Type.STRING,
            description: "Code officiel SAP si reconnu (ex: C_TS4FI_2601)",
          },
          year: { type: Type.STRING },
          issuer: { type: Type.STRING },
        },
        required: ["name"],
      },
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          level: { type: Type.STRING },
        },
        required: ["name", "level"],
      },
    },
    atsTips: {
      type: Type.ARRAY,
      description:
        "2-5 conseils ACTIONNABLES pour améliorer le CV (ex: 'Ajoute le T-code FBL3N dans ton bullet sur les rapprochements', 'Précise la version S/4HANA utilisée'). PAS 'soigne la mise en page' (générique).",
      items: { type: Type.STRING },
    },
    atsScore: {
      type: Type.INTEGER,
      description:
        "Score de lisibilité ATS sur 100. Critères : keywords SAP, action verbs, quantification, structure standard, exhaustivité. <60 = à retravailler. 80+ = solide.",
    },
  },
  required: [
    "identity",
    "summary",
    "experiences",
    "education",
    "skills",
    "certifications",
    "languages",
    "atsTips",
    "atsScore",
  ],
};

export async function POST(req: NextRequest) {
  const auth = await requireProUser(req);
  if ("status" in auth) return auth;

  const ip = getClientIp(req);
  // 3 optimisations / heure / user — le CV change peu donc pas besoin de plus.
  if (!(await rateLimit(`cv-opt:user:${auth.user.userId}`, 3, 60 * 60 * 1000))) {
    return err("Tu as déjà optimisé 3 CV cette heure. Réessaie plus tard.", 429);
  }
  if (!(await rateLimit(`cv-opt:ip:${ip}`, 10, 60 * 60 * 1000))) {
    return err("Trop d'optimisations depuis cette IP. Réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);

  const data = validated.data;

  const systemInstruction = `Tu es un coach CV spécialisé recrutement SAP en France, qui optimise des CV pour passer les filtres ATS (Taleo, Workday, iCIMS) des grandes ESN (Capgemini, Accenture, Deloitte, CGI, Sopra Steria) et clients finaux (LVMH, Saint-Gobain, Renault…).

Le candidat vise : "${data.targetRole}" (${data.yearsExperience} ans d'XP).

Tu reçois un CV brut, tu le réécris pour maximiser ses chances de passer les ATS. Règles ABSOLUES :

1. ACTION VERBS forts au début de chaque bullet : "Configuré", "Déployé", "Piloté", "Réduit", "Automatisé", "Migré", "Implémenté", "Réconcilié". JAMAIS "participé à", "aidé à", "été en charge de".

2. QUANTIFICATION partout où possible : "12 sociétés", "réduisant de 8 à 3 jours", "économisant 200K€", "pour 800 utilisateurs finaux". Si l'utilisateur n'a pas chiffré, NE PAS inventer — laisser sans chiffre est mieux qu'inventer.

3. VOCABULAIRE SAP OFFICIEL et précis :
   - T-codes : FB50, MIRO, ME21N, VA01, MM01, MIGO, F-02, FBL3N, FAGLL03, KO01, KS01 (utilise ceux pertinents au rôle)
   - Modules : FI, CO, MM, SD, PP, HCM/SuccessFactors, EWM, TM, PM, QM
   - Tech : S/4HANA Cloud Public/Private, S/4HANA on-premise, ECC 6.0, ABAP, BTP, CAP, Fiori, SAC, Datasphere, BW/4HANA, AI Core, Joule
   - Méthodo : SAP Activate, Fit-to-Standard, Greenfield/Brownfield/Hybrid, RICEF
   - Si l'utilisateur écrit "Hana", remplace par "S/4HANA". Si "abap", utilise "ABAP" (majuscules).

4. STRUCTURE STANDARD : ne mets PAS de tableaux exotiques, pas de date "in progress", pas de smileys. ATS = lecture linéaire.

5. SUMMARY : 3-5 phrases. Format = "Consultant SAP [module] avec X ans d'XP sur [secteur]. Spécialiste de [3 expertises concrètes]. A piloté [résultat marquant chiffré ou nature de mission]. Cherche un poste de [targetRole exact]."

6. SKILLS catégorisés en 4 buckets : sap (modules/T-codes/tech SAP), technical (autres), methods (méthodologies), soft (soft skills CONCRÈTES style "Animation comité de pilotage").

7. CERTIFS : utilise le code officiel SAP quand reconnu (C_TS4FI_2601 = Financial Accounting S/4HANA, C_TS460_2023 = Sales, etc.). Si "SAP Certified Associate FI", complète avec "C_TS4FI_2601".

8. atsScore : honnête. Si le CV brut a peu de quantification, peu de T-codes, soft skills génériques → 50-60. Si tout est solide → 80-90. Au-delà de 90 = vraiment exceptionnel.

9. atsTips : pointe ce que LE CANDIDAT DOIT AJOUTER LUI-MÊME pour passer à 90+. Sois précis sur quoi (T-codes, projets manquants, chiffres à compléter).

10. NE TRADUIS PAS les noms d'entreprise, écoles, certifs officielles. NE GONFLE PAS les responsabilités. Reste fidèle à ce que l'utilisateur a écrit, mais reformule.

11. Tutoie le candidat dans atsTips. Reste FACTUEL et CONCIS partout ailleurs.

Réponds en français.`;

  const userPrompt = `Voici les données brutes saisies par le candidat :

${JSON.stringify(data, null, 2)}

Optimise ce CV pour ATS selon les règles. Renvoie le JSON structuré complet.`;

  try {
    const result = await generateJSON({
      caller: "cv/optimize",
      systemInstruction,
      userPrompt,
      geminiSchema: geminiResponseSchema,
      zodSchema: responseZod,
      temperature: 0.4, // peu créatif : on veut du factuel
    });
    return ok({ cv: result.data, provider: result.provider, usage: result.usage });
  } catch (e) {
    if (isAiError(e)) {
      if (e.kind === "rate_limit") {
        const hint = e.retryAfterSeconds ? ` Réessaie dans ~${e.retryAfterSeconds}s.` : " Réessaie plus tard.";
        return err(`Service IA temporairement saturé.${hint}`, 429);
      }
      if (e.kind === "no_provider" || e.kind === "auth") return err(e.message, 503);
      if (e.kind === "invalid_response") return err("Réponse IA invalide.", 500);
    }
    console.error("[cv/optimize] failed:", e);
    return err("Erreur lors de l'optimisation du CV.", 500);
  }
}
