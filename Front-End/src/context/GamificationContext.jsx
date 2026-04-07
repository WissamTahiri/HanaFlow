import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  { id: "exam_hcm",     icon: "🎓", name: "Simulateur HCM",        desc: "Terminer le simulateur d'examen HCM",           xp: 300, category: "Examens" },
  { id: "exam_pp",      icon: "🎓", name: "Simulateur PP",         desc: "Terminer le simulateur d'examen PP",            xp: 300, category: "Examens" },
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

// ── Context ───────────────────────────────────────────────────────────────────
const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const { token, isAuthenticated } = useAuth();

  const [xp, setXP] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [quizPassCount, setQuizPassCount] = useState(0);
  const [notification, setNotification] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Evite de re-fetch si déjà chargé pour cette session
  const loadedRef = useRef(false);

  // Charge l'état depuis le serveur
  const fetchState = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch(`${API_URL}/gamification`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) return;
      const data = await res.json();
      setXP(data.xp ?? 0);
      setEarnedBadges(data.badges ?? []);
      setStreak(data.streak ?? 0);
      setQuizPassCount(data.quiz_pass_count ?? 0);
      setLoaded(true);
    } catch { /* silencieux si offline */ }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && !loadedRef.current) {
      loadedRef.current = true;
      fetchState();
    }
    if (!isAuthenticated) {
      loadedRef.current = false;
      setLoaded(false);
      setXP(0);
      setEarnedBadges([]);
      setStreak(0);
      setQuizPassCount(0);
    }
  }, [isAuthenticated, fetchState]);

  // Envoie un événement au serveur et applique les retours
  const sendEvent = useCallback(async (type, payload = {}) => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch(`${API_URL}/gamification/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ type, payload }),
      });
      if (!res.ok) return;
      const data = await res.json();

      setXP(data.xp);
      setEarnedBadges(data.badges);
      setStreak(data.streak);
      setQuizPassCount(data.quiz_pass_count);

      // Affiche une notification pour chaque nouveau badge
      if (data.newBadges?.length > 0) {
        const badge = BADGES.find((b) => b.id === data.newBadges[0]);
        if (badge) setNotification({ badge, ts: Date.now() });
      }
    } catch { /* silencieux si offline */ }
  }, [isAuthenticated, token]);

  const hasBadge = useCallback((id) => earnedBadges.includes(id), [earnedBadges]);

  const onLogin = useCallback(() => sendEvent("login"), [sendEvent]);
  const onModuleVisit = useCallback((visitedCount) => sendEvent("module_visit", { visitedCount }), [sendEvent]);
  const onLessonComplete = useCallback((module, lessonCount) => sendEvent("lesson_complete", { module, lessonCount }), [sendEvent]);
  const onQuizPass = useCallback((score100) => sendEvent("quiz_pass", { score100 }), [sendEvent]);
  const onExamComplete = useCallback((module, passed) => sendEvent("exam_complete", { module, passed }), [sendEvent]);
  const onProActivated = useCallback(() => sendEvent("pro_activated"), [sendEvent]);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return (
    <GamificationContext.Provider value={{
      xp, earnedBadges, streak, quizPassCount, loaded,
      hasBadge,
      onLogin, onModuleVisit, onLessonComplete, onQuizPass, onExamComplete, onProActivated,
      notification, dismissNotification,
      levelInfo: getLevelInfo(xp),
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
