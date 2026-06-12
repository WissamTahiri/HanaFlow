/**
 * Catalogue gamification partagé client/serveur : badges, niveaux, helpers.
 * Aucune dépendance React ni Node — importable depuis le contexte client
 * comme depuis les API routes (qui recalculent l'XP côté serveur).
 */

export interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
  xp: number;
  category: string;
}

export interface LevelInfo {
  current: { level: number; name: string; minXP: number };
  next: { level: number; name: string; minXP: number } | null;
  progress: number;
  xpInLevel: number;
  xpToNext: number;
}

export const BADGES: Badge[] = [
  { id: "welcome",      icon: "👋", name: "Bienvenue !",    desc: "Créer un compte sur HanaFlow",                  xp: 50,  category: "Démarrage" },
  { id: "first_module", icon: "🚀", name: "Premier pas",    desc: "Visiter un premier module SAP",                 xp: 100, category: "Démarrage" },
  { id: "explorer",     icon: "🔭", name: "Explorateur",    desc: "Visiter 3 modules SAP différents",              xp: 150, category: "Démarrage" },
  { id: "sap_expert",   icon: "🏆", name: "Expert SAP",     desc: "Visiter les 6 modules SAP",                     xp: 300, category: "Démarrage" },
  { id: "lesson_fi",    icon: "📚", name: "Étudiant FI",    desc: "Compléter 5 leçons en certification FI",        xp: 150, category: "Certifications" },
  { id: "lesson_co",    icon: "📊", name: "Étudiant CO",    desc: "Compléter 5 leçons en certification CO",        xp: 150, category: "Certifications" },
  { id: "lesson_mm",    icon: "📦", name: "Étudiant MM",    desc: "Compléter 5 leçons en certification MM",        xp: 150, category: "Certifications" },
  { id: "lesson_sd",    icon: "🚚", name: "Étudiant SD",    desc: "Compléter 5 leçons en certification SD",        xp: 150, category: "Certifications" },
  { id: "quiz_perfect", icon: "💯", name: "Sans faute",     desc: "Réussir un quiz de chapitre avec 100%",         xp: 200, category: "Quiz" },
  { id: "quiz_pass",    icon: "✅", name: "Validé",          desc: "Réussir 3 quiz de chapitre (≥65%)",             xp: 200, category: "Quiz" },
  { id: "exam_fi",      icon: "🎓", name: "Simulateur FI",  desc: "Terminer le simulateur d'examen FI",            xp: 300, category: "Examens" },
  { id: "exam_co",      icon: "🎓", name: "Simulateur CO",  desc: "Terminer le simulateur d'examen CO",            xp: 300, category: "Examens" },
  { id: "exam_mm",      icon: "🎓", name: "Simulateur MM",  desc: "Terminer le simulateur d'examen MM",            xp: 300, category: "Examens" },
  { id: "exam_sd",      icon: "🎓", name: "Simulateur SD",  desc: "Terminer le simulateur d'examen SD",            xp: 300, category: "Examens" },
  { id: "exam_pass",    icon: "⭐", name: "Reçu !",          desc: "Passer un simulateur d'examen avec ≥65%",       xp: 500, category: "Examens" },
  { id: "streak_3",     icon: "🔥", name: "En feu",          desc: "Se connecter 3 jours consécutifs",              xp: 100, category: "Régularité" },
  { id: "streak_7",     icon: "💪", name: "Dédié",           desc: "Se connecter 7 jours consécutifs",              xp: 250, category: "Régularité" },
  { id: "pro_member",   icon: "👑", name: "Membre Pro",     desc: "Activer le plan Pro",                           xp: 100, category: "Abonnement" },
];

export const LEVELS = [
  { level: 1,  name: "Débutant",   minXP: 0 },
  { level: 2,  name: "Initié",     minXP: 200 },
  { level: 3,  name: "Apprenti",   minXP: 500 },
  { level: 4,  name: "Confirmé",   minXP: 1000 },
  { level: 5,  name: "Praticien",  minXP: 1800 },
  { level: 6,  name: "Consultant", minXP: 2800 },
  { level: 7,  name: "Senior",     minXP: 4000 },
  { level: 8,  name: "Expert SAP", minXP: 5500 },
  { level: 9,  name: "Architecte", minXP: 7500 },
  { level: 10, name: "SAP Master", minXP: 10000 },
];

export function getLevelInfo(xp: number): LevelInfo {
  let current = LEVELS[0];
  let next: typeof LEVELS[0] | null = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
      break;
    }
  }
  const progress = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;
  return { current, next, progress, xpInLevel: xp - current.minXP, xpToNext: next ? next.minXP - xp : 0 };
}

export const getBadge = (id: string) => BADGES.find((b) => b.id === id);

/** XP gagné pour un quiz de chapitre selon le score (%). */
export const quizXp = (scorePct: number) => (scorePct === 100 ? 150 : 75);
/** XP gagné pour un simulateur d'examen selon réussite (≥65 %). */
export const examXp = (passed: boolean) => (passed ? 400 : 150);
/** XP gagné pour une leçon complétée. */
export const LESSON_XP = 25;
