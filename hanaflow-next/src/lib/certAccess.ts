import "server-only";
import { fiCertification, fiMockExamQuestions } from "@/data/certifications/fi.js";
import { coCertification, coMockExamQuestions } from "@/data/certifications/co.js";
import { mmCertification, mmMockExamQuestions } from "@/data/certifications/mm.js";
import { sdCertification, sdMockExamQuestions } from "@/data/certifications/sd.js";
import { hcmCertification, hcmMockExamQuestions } from "@/data/certifications/hcm.js";
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
  hcm: { cert: hcmCertification, exam: hcmMockExamQuestions },
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
  if (isPro) return data.cert;

  const cert = data.cert as CertShape;
  return {
    ...cert,
    chapters: cert.chapters.map((ch) =>
      ch.isPremium
        ? { ...ch, lessons: [], quiz: [], locked: true }
        : ch,
    ),
  };
}

/**
 * Renvoie les questions d'examen — Pro uniquement (le caller doit avoir vérifié).
 */
export function getExamQuestions(moduleId: ModuleId) {
  return CERT_MAP[moduleId].exam;
}

export function getCertMeta(moduleId: ModuleId) {
  const cert = CERT_MAP[moduleId].cert as { code: string; shortName: string };
  return { code: cert.code, shortName: cert.shortName };
}
