"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { BADGES, LEVELS, getLevelInfo, getBadge, quizXp, examXp, LESSON_XP } from "@/lib/gamification";
import type { Badge, LevelInfo } from "@/lib/gamification";

// Ré-exports : le catalogue vit dans lib/gamification (partagé serveur),
// mais les composants existants importent depuis ce contexte.
export { BADGES, LEVELS, getLevelInfo };
export type { Badge, LevelInfo };

/**
 * Gamification — XP, badges, streaks.
 *
 * - User CONNECTÉ : le serveur est la source de vérité (table
 *   user_gamification). Chaque action déclenche un événement API ; le client
 *   ne fait qu'afficher l'état renvoyé. Impossible de tricher en éditant le
 *   localStorage : il n'est même plus lu.
 * - Visiteur ANONYME : fallback localStorage (aperçu local, non synchronisé).
 */

const load = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};
const save = (key: string, val: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

type QuizSubmission = {
  module: string;
  kind: "quiz" | "exam";
  chapterId?: string;
  /** Score en pourcentage 0-100. */
  scorePct: number;
  questionsTotal: number;
};

interface GamificationContextValue {
  xp: number;
  earnedBadges: string[];
  hasBadge: (id: string) => boolean;
  onLogin: () => void;
  onModuleVisit: (visitedCount: number) => void;
  onLessonComplete: (module: string, lessonCount: number) => void;
  /** Enregistre la tentative (DB si connecté) + XP/badges. */
  submitQuizAttempt: (s: QuizSubmission) => void;
  onProActivated: () => void;
  notification: { badge: Badge; ts: number } | null;
  dismissNotification: () => void;
  levelInfo: LevelInfo;
  streak: number;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

type ServerState = {
  totalXp: number;
  badges: string[];
  streakCurrent: number;
  streakBest: number;
  quizPassCount: number;
};

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  // Ref mise à jour en effect (règle react-hooks/refs) : les callbacks
  // d'événements lisent toujours le token courant sans se re-créer.
  const tokenRef = useRef<string | null>(null);
  useEffect(() => { tokenRef.current = token; }, [token]);

  const [xp, setXP] = useState(() => load("hf_xp", 0));
  const [earnedBadges, setEarnedBadges] = useState<string[]>(() => load("hf_badges", []));
  const [, setQuizPassCount] = useState(() => load("hf_quiz_pass", 0));
  const [streak, setStreak] = useState(() => load("hf_streak", 0));
  const [notification, setNotification] = useState<{ badge: Badge; ts: number } | null>(null);

  const applyServerState = useCallback((state: ServerState, newBadges: string[] = []) => {
    setXP(state.totalXp);
    setEarnedBadges(state.badges);
    setStreak(state.streakCurrent);
    setQuizPassCount(state.quizPassCount);
    const firstNew = newBadges.map(getBadge).find(Boolean);
    if (firstNew) setNotification({ badge: firstNew, ts: Date.now() });
  }, []);

  // Au login : remplacer l'état local par l'état serveur. Si l'état serveur
  // est vierge mais que le localStorage contient une ancienne progression
  // (compte pré-migration), on l'importe une fois via /migrate — le serveur
  // recalcule l'XP depuis les badges, le client ne décide rien.
  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/gamification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        let state: ServerState = data.gamification;

        const legacyBadges = load<string[]>("hf_badges", []);
        if (state.totalXp === 0 && state.badges.length === 0 && legacyBadges.length > 0) {
          const mig = await fetch("/api/gamification/migrate", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ badges: legacyBadges, streak: load("hf_streak", 0) }),
          });
          if (mig.ok && !cancelled) {
            state = (await mig.json()).gamification;
          }
        }
        if (!cancelled) applyServerState(state);
      } catch { /* offline : on garde l'affichage courant */ }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, token, applyServerState]);

  /** POST un événement serveur ; renvoie false si non connecté. */
  const sendEvent = useCallback((payload: Record<string, unknown>, path = "/api/gamification/event") => {
    const t = tokenRef.current;
    if (!t) return false;
    fetch(path, {
      method: "POST",
      headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        applyServerState(data.gamification, data.newBadges);
      })
      .catch(() => { /* silencieux si offline */ });
    return true;
  }, [applyServerState]);

  // ── Fallback local (visiteurs anonymes uniquement) ─────────────────
  const localAward = useCallback((id: string) => {
    setEarnedBadges((prev) => {
      if (prev.includes(id)) return prev;
      const badge = getBadge(id);
      if (!badge) return prev;
      const next = [...prev, id];
      save("hf_badges", next);
      setXP((x) => { const nx = x + badge.xp; save("hf_xp", nx); return nx; });
      setNotification({ badge, ts: Date.now() });
      return next;
    });
  }, []);

  const localAddXP = useCallback((amount: number) => {
    setXP((prev) => { const next = prev + amount; save("hf_xp", next); return next; });
  }, []);

  const hasBadge = useCallback((id: string) => earnedBadges.includes(id), [earnedBadges]);

  const onLogin = useCallback(() => {
    if (sendEvent({ type: "login" })) return;
    localAward("welcome");
    const today = new Date().toDateString();
    const lastLogin = load<string | null>("hf_last_login", null);
    if (lastLogin !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      setStreak((prev) => {
        const newStreak = lastLogin === yesterday ? prev + 1 : 1;
        save("hf_streak", newStreak);
        if (newStreak >= 7) localAward("streak_7");
        else if (newStreak >= 3) localAward("streak_3");
        return newStreak;
      });
      save("hf_last_login", today);
    }
  }, [sendEvent, localAward]);

  const onModuleVisit = useCallback((visitedCount: number) => {
    if (sendEvent({ type: "module_visit" })) return;
    if (visitedCount >= 1) localAward("first_module");
    if (visitedCount >= 3) localAward("explorer");
    if (visitedCount >= 6) localAward("sap_expert");
  }, [sendEvent, localAward]);

  const onLessonComplete = useCallback((module: string, lessonCount: number) => {
    if (sendEvent({ type: "lesson_complete", module, lessonCount })) return;
    localAddXP(LESSON_XP);
    if (lessonCount >= 5) localAward(`lesson_${module}`);
  }, [sendEvent, localAward, localAddXP]);

  const submitQuizAttempt = useCallback(({ module, kind, chapterId, scorePct, questionsTotal }: QuizSubmission) => {
    const sent = sendEvent(
      { moduleCode: module, kind, chapterId, score: scorePct, questionsTotal },
      "/api/quiz/submit",
    );
    if (sent) return;
    // Anonyme : XP local, pas d'historique de tentative possible.
    if (kind === "quiz") {
      localAddXP(quizXp(scorePct));
      if (scorePct === 100) localAward("quiz_perfect");
      if (scorePct >= 65) {
        setQuizPassCount((prev) => {
          const next = prev + 1;
          save("hf_quiz_pass", next);
          if (next >= 3) localAward("quiz_pass");
          return next;
        });
      }
    } else {
      const passed = scorePct >= 65;
      localAddXP(examXp(passed));
      localAward(`exam_${module}`);
      if (passed) localAward("exam_pass");
    }
  }, [sendEvent, localAward, localAddXP]);

  const onProActivated = useCallback(() => {
    if (sendEvent({ type: "pro_activated" })) return;
    localAward("pro_member");
  }, [sendEvent, localAward]);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return (
    <GamificationContext.Provider value={{
      xp, earnedBadges, hasBadge,
      onLogin, onModuleVisit, onLessonComplete, submitQuizAttempt, onProActivated,
      notification, dismissNotification,
      levelInfo: getLevelInfo(xp),
      streak,
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
