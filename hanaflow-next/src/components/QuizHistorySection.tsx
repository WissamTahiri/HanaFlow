"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";

type Attempt = {
  id: number;
  moduleCode: string;
  kind: "quiz" | "exam";
  chapterId: string | null;
  score: number;
  questionsTotal: number;
  attemptedAt: string;
};

type Best = { moduleCode: string; kind: string; bestScore: number | null; attempts: number };

const MODULE_LABELS: Record<string, string> = {
  fi: "FI", co: "CO", mm: "MM", sd: "SD", pp: "PP", ai: "AI",
};

const scoreColor = (score: number) =>
  score >= 65
    ? "text-emerald-600 dark:text-emerald-400"
    : score >= 40
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-500 dark:text-red-400";

/**
 * Historique des tentatives de quiz/examens (dashboard).
 * Ne rend rien tant qu'aucune tentative n'est enregistrée.
 */
export default function QuizHistorySection() {
  const { token, isAuthenticated } = useAuth();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [best, setBest] = useState<Best[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/quiz/attempts?limit=8", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setAttempts(data.attempts);
          setBest(data.best);
        }
      } catch { /* silencieux */ }
      finally { if (!cancelled) setLoaded(true); }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, token]);

  if (!loaded || attempts.length === 0) return null;

  const bestExams = best.filter((b) => b.kind === "exam" && b.bestScore !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Mes tentatives</h2>
        <Link href="/stats" className="text-xs text-sap-blue dark:text-sap-accent hover:underline font-medium">
          Toutes mes stats
        </Link>
      </div>

      {bestExams.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {bestExams.map((b) => (
            <span
              key={b.moduleCode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-700 text-xs"
            >
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {MODULE_LABELS[b.moduleCode] ?? b.moduleCode.toUpperCase()}
              </span>
              <span className="text-slate-400">meilleur examen :</span>
              <span className={`font-bold ${scoreColor(b.bestScore!)}`}>{b.bestScore}%</span>
            </span>
          ))}
        </div>
      )}

      <ul className="divide-y divide-gray-100 dark:divide-slate-700">
        {attempts.map((a) => (
          <li key={a.id} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="w-9 text-xs font-bold text-slate-500 dark:text-slate-400">
              {MODULE_LABELS[a.moduleCode] ?? a.moduleCode.toUpperCase()}
            </span>
            <span className="flex-1 text-slate-600 dark:text-slate-300">
              {a.kind === "exam" ? "Simulateur d'examen" : `Quiz ${a.chapterId ?? "chapitre"}`}
            </span>
            <span className="text-xs text-slate-400 hidden sm:block">
              {new Date(a.attemptedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
            </span>
            <span className={`w-12 text-right font-bold ${scoreColor(a.score)}`}>{a.score}%</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
