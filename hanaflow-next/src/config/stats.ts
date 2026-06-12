/**
 * Source de vérité des chiffres marketing affichés sur les pages publiques
 * (home, à-propos, modules-sap, pricing…).
 *
 * Les valeurs sont comptées depuis les banques de contenu réelles
 * (src/data/certifications/*.js) et validées par stats.test.ts : si le contenu
 * évolue (nouveau chapitre, nouvelles questions), le test échoue et rappelle
 * de mettre à jour ce fichier. Ne jamais hardcoder ces chiffres dans une page.
 */
export const HANAFLOW_STATS = {
  /** FI, CO, MM, SD, PP, IA générative. */
  modules: 6,
  /** 7 chapitres × 5 modules + 5 chapitres pour IA. */
  chapitres: 40,
  /** Leçons documentées (concepts clés) tous modules confondus. */
  lecons: 90,
  /** Questions des simulateurs d'examen (80 × 5 modules + 30 IA). */
  questionsExamen: 430,
  /** Questions des quiz de fin de chapitre. */
  questionsQuiz: 233,
  /** Un simulateur d'examen par module. */
  simulateurs: 6,
  /**
   * Estimations marketing (non comptées depuis le contenu, donc non
   * vérifiées par stats.test.ts) — à réviser à la main si le contenu évolue.
   */
  tcodesCouverts: "200+",
  heuresContenu: "48h+",
} as const;

/** Total toutes questions confondues (simulateurs + quiz de chapitre). */
export const QUESTIONS_TOTAL =
  HANAFLOW_STATS.questionsExamen + HANAFLOW_STATS.questionsQuiz;
