import { createContext, useContext, useState, useCallback } from "react";

// ── Définition des badges ────────────────────────────────────────────────────
export const BADGES = [
  // Onboarding
  { id: "welcome",      icon: "👋", name: "Bienvenue !",          desc: "Créer un compte sur HanaFlow",                  xp: 50,  category: "Démarrage" },
  { id: "first_module", icon: "🚀", name: "Premier pas",           desc: "Visiter un premier module SAP",                 xp: 100, category: "Démarrage" },
  { id: "explorer",     icon: "🔭", name: "Explorateur",           desc: "Visiter 3 modules SAP différents",              xp: 150, category: "Démarrage" },
  { id: "sap_expert",   icon: "🏆", name: "Expert SAP",            desc: "Visiter les 6 modules SAP",                     xp: 300, category: "Démarrage" },

  // Certifications — leçons
  { id: "lesson_fi",    icon: "📚", name: "Étudiant FI",           desc: "Compléter 5 leçons en certification FI",        xp: 150, category: "Certifications" },
  { id: "lesson_co",    icon: "📊", name: "Étudiant CO",           desc: "Compléter 5 leçons en certification CO",        xp: 150, category: "Certifications" },
  { id: "lesson_mm",    icon: "📦", name: "Étudiant MM",           desc: "Compléter 5 leçons en certification MM",        xp: 150, category: "Certifications" },
  { id: "lesson_sd",    icon: "🚚", name: "Étudiant SD",           desc: "Compléter 5 leçons en certification SD",        xp: 150, category: "Certifications" },

  // Quiz
  { id: "quiz_perfect", icon: "💯", name: "Sans faute",            desc: "Réussir un quiz de chapitre avec 100%",         xp: 200, category: "Quiz" },
  { id: "quiz_pass",    icon: "✅", name: "Validé",                 desc: "Réussir 3 quiz de chapitre (≥65%)",             xp: 200, category: "Quiz" },

  // Simulateurs
  { id: "exam_fi",      icon: "🎓", name: "Simulateur FI",         desc: "Terminer le simulateur d'examen FI",            xp: 300, category: "Examens" },
  { id: "exam_co",      icon: "🎓", name: "Simulateur CO",         desc: "Terminer le simulateur d'examen CO",            xp: 300, category: "Examens" },
  { id: "exam_mm",      icon: "🎓", name: "Simulateur MM",         desc: "Terminer le simulateur d'examen MM",            xp: 300, category: "Examens" },
  { id: "exam_sd",      icon: "🎓", name: "Simulateur SD",         desc: "Terminer le simulateur d'examen SD",            xp: 300, category: "Examens" },
  { id: "exam_pass",    icon: "⭐", name: "Reçu !",                desc: "Passer un simulateur d'examen avec ≥65%",       xp: 500, category: "Examens" },

  // Régularité
  { id: "streak_3",     icon: "🔥", name: "En feu",                desc: "Se connecter 3 jours consécutifs",              xp: 100, category: "Régularité" },
  { id: "streak_7",     icon: "💪", name: "Dédié",                 desc: "Se connecter 7 jours consécutifs",              xp: 250, category: "Régularité" },

  // Pro
  { id: "pro_member",   icon: "👑", name: "Membre Pro",            desc: "Activer le plan Pro",                           xp: 100, category: "Abonnement" },
];

// ── Paliers de niveaux ────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1,  name: "Débutant",      minXP: 0 },
  { level: 2,  name: "Initié",        minXP: 200 },
  { level: 3,  name: "Apprenti",      minXP: 500 },
  { level: 4,  name: "Confirmé",      minXP: 1000 },
  { level: 5,  name: "Praticien",     minXP: 1800 },
  { level: 6,  name: "Consultant",    minXP: 2800 },
  { level: 7,  name: "Senior",        minXP: 4000 },
  { level: 8,  name: "Expert SAP",    minXP: 5500 },
  { level: 9,  name: "Architecte",    minXP: 7500 },
  { level: 10, name: "SAP Master",    minXP: 10000 },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) { current = LEVELS[i]; next = LEVELS[i + 1] || null; break; }
  }
  const progress = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;
  return { current, next, progress, xpInLevel: xp - current.minXP, xpToNext: next ? next.minXP - xp : 0 };
}

// ── Helpers localStorage ──────────────────────────────────────────────────────
const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; } };
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ── Context ───────────────────────────────────────────────────────────────────
const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const [xp, setXP] = useState(() => load("hf_xp", 0));
  const [earnedBadges, setEarnedBadges] = useState(() => load("hf_badges", []));
  const [quizPassCount, setQuizPassCount] = useState(() => load("hf_quiz_pass", 0));
  // notification queue for toast
  const [notification, setNotification] = useState(null);

  const hasBadge = useCallback((id) => earnedBadges.includes(id), [earnedBadges]);

  const awardBadge = useCallback((id) => {
    setEarnedBadges((prev) => {
      if (prev.includes(id)) return prev;
      const badge = BADGES.find((b) => b.id === id);
      if (!badge) return prev;
      const next = [...prev, id];
      save("hf_badges", next);
      // give XP + show notification
      setXP((x) => { const nx = x + badge.xp; save("hf_xp", nx); return nx; });
      setNotification({ badge, ts: Date.now() });
      return next;
    });
  }, []);

  const addXP = useCallback((amount) => {
    setXP((prev) => { const next = prev + amount; save("hf_xp", next); return next; });
  }, []);

  // ── Événements déclencheurs ───────────────────────────────────────────────
  const onLogin = useCallback(() => {
    awardBadge("welcome");
    // streak logic
    const today = new Date().toDateString();
    const lastLogin = load("hf_last_login", null);
    const streak = load("hf_streak", 0);
    if (lastLogin !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastLogin === yesterday ? streak + 1 : 1;
      save("hf_streak", newStreak);
      save("hf_last_login", today);
      if (newStreak >= 7) awardBadge("streak_7");
      else if (newStreak >= 3) awardBadge("streak_3");
    }
  }, [awardBadge]);

  const onModuleVisit = useCallback((visitedCount) => {
    if (visitedCount >= 1) awardBadge("first_module");
    if (visitedCount >= 3) awardBadge("explorer");
    if (visitedCount >= 6) awardBadge("sap_expert");
  }, [awardBadge]);

  const onLessonComplete = useCallback((module, lessonCount) => {
    addXP(25);
    if (lessonCount >= 5) awardBadge(`lesson_${module}`);
  }, [awardBadge, addXP]);

  const onQuizPass = useCallback((score100) => {
    addXP(score100 === 100 ? 150 : 75);
    if (score100 === 100) awardBadge("quiz_perfect");
    setQuizPassCount((prev) => {
      const next = prev + 1;
      save("hf_quiz_pass", next);
      if (next >= 3) awardBadge("quiz_pass");
      return next;
    });
  }, [awardBadge, addXP]);

  const onExamComplete = useCallback((module, passed) => {
    addXP(passed ? 400 : 150);
    awardBadge(`exam_${module}`);
    if (passed) awardBadge("exam_pass");
  }, [awardBadge, addXP]);

  const onProActivated = useCallback(() => {
    awardBadge("pro_member");
  }, [awardBadge]);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return (
    <GamificationContext.Provider value={{
      xp, earnedBadges, hasBadge, awardBadge, addXP,
      onLogin, onModuleVisit, onLessonComplete, onQuizPass, onExamComplete, onProActivated,
      notification, dismissNotification,
      levelInfo: getLevelInfo(xp),
      streak: load("hf_streak", 0),
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used inside GamificationProvider");
  return ctx;
};
