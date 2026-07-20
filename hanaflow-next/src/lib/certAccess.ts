import "server-only";
import { certCode } from "./certCodes";
import { fiCertification, fiMockExamQuestions } from "@/data/certifications/fi.js";
import { coCertification, coMockExamQuestions } from "@/data/certifications/co.js";
import { mmCertification, mmMockExamQuestions } from "@/data/certifications/mm.js";
import { sdCertification, sdMockExamQuestions } from "@/data/certifications/sd.js";
import { aiCertification, aiMockExamQuestions } from "@/data/certifications/ai.js";
import { ppCertification, ppMockExamQuestions } from "@/data/certifications/pp.js";

/**
 * Catalogue des certifications — importé UNIQUEMENT depuis des Server Components
 * ou des API routes. Si ce fichier est importé par un Client Component, "server-only"
 * lèvera une erreur de build.
 */
const CERT_MAP = {
  fi: { cert: fiCertification, exam: fiMockExamQuestions },
  co: { cert: coCertification, exam: coMockExamQuestions },
  mm: { cert: mmCertification, exam: mmMockExamQuestions },
  sd: { cert: sdCertification, exam: sdMockExamQuestions },
  ai: { cert: aiCertification, exam: aiMockExamQuestions },
  pp: { cert: ppCertification, exam: ppMockExamQuestions },
} as const;

export type ModuleId = keyof typeof CERT_MAP;

export function isValidModule(id: string): id is ModuleId {
  return id in CERT_MAP;
}

/**
 * Renvoie le contenu de la certification adapté au plan de l'utilisateur :
 * - Pro : tout
 * - Free : les chapitres `isPremium` ont leurs leçons/quiz vidés (titres conservés
 *   pour afficher le cadenas dans l'UI). Les contenus payants ne sont jamais
 *   sérialisés dans le bundle client d'un user free.
 */
// Les bundles `*.cert` sont déclarés en `.js` (data files) → TS les voit comme
// `unknown`. On les traite ici comme `Record<string, unknown>` côté chapter
// pour préserver le typage du Cert global tout en autorisant le mapping.
// Les bundles `*.cert` viennent de data files .js → on les voit en TS comme
// des objets dont la forme exacte (id/title/lessons sur les chapitres) est
// vérifiée à runtime via les schémas qui les produisent. On expose un type
// `unknown`-compatible côté caller, qui passe les props à CertificationTemplate
// (lequel applique son propre type strict en interne).
type ChapterShape = { isPremium: boolean; [k: string]: unknown };
type CertShape = {
  id: string;
  color: string;
  chapters: ChapterShape[];
  [k: string]: unknown;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCertForPlan(moduleId: ModuleId, isPro: boolean): any {
  const data = CERT_MAP[moduleId];
  const code = certCode(moduleId);
  if (isPro) return { ...(data.cert as CertShape), code };

  const cert = data.cert as CertShape;
  return {
    ...cert,
    code,
    chapters: cert.chapters.map((ch) =>
      ch.isPremium
        ? { ...ch, lessons: [], quiz: [], locked: true }
        : ch,
    ),
  };
}

/**
 * Renvoie les questions d'examen — Pro uniquement (le caller doit avoir vérifié).
 *
 * Usage réservé aux contextes serveur qui ont besoin de la banque complète
 * (ex: notation dans POST /api/quiz/submit). Ne JAMAIS passer cette valeur en
 * props à un composant client : `correctIndex` serait sérialisé dans le
 * payload RSC et donc visible avant même que le candidat réponde à une
 * question, ce qui permettrait de forger un score d'examen 100% "vérifié
 * serveur" (le serveur note contre la même clé de correction qu'il vient de
 * divulguer). Pour l'UI, utiliser `getExamQuestionsForClient`.
 */
export function getExamQuestions(moduleId: ModuleId) {
  return CERT_MAP[moduleId].exam;
}

export type ClientExamQuestion = {
  id?: string | number;
  question: string;
  options: string[];
  explanation: string;
  chapter: string;
};

/**
 * Version des questions d'examen sûre à passer à un Client Component :
 * `correctIndex` est retiré. Le score reste calculé côté serveur dans
 * POST /api/quiz/submit à partir de `getExamQuestions` (banque complète,
 * jamais exposée au client), qui renvoie ensuite la correction par question
 * une fois la tentative déjà enregistrée en base.
 */
export function getExamQuestionsForClient(moduleId: ModuleId): ClientExamQuestion[] {
  return CERT_MAP[moduleId].exam.map(({ correctIndex: _correctIndex, ...rest }) => rest);
}

export function getCertMeta(moduleId: ModuleId) {
  const cert = CERT_MAP[moduleId].cert as { shortName: string };
  return { code: certCode(moduleId), shortName: cert.shortName };
}

export type CanonicalQuestion = { id?: string | number; correctIndex: number };

/**
 * Renvoie les questions du quiz d'un chapitre (banque officielle), pour
 * notation côté serveur. Retourne `null` si le module ou le chapitre
 * n'existe pas.
 */
export function getChapterQuiz(moduleId: ModuleId, chapterId: string): CanonicalQuestion[] | null {
  const cert = CERT_MAP[moduleId].cert as CertShape;
  const chapter = cert.chapters.find((ch) => (ch as { id?: string }).id === chapterId);
  if (!chapter) return null;
  const quiz = (chapter as { quiz?: CanonicalQuestion[] }).quiz;
  return quiz ?? null;
}
