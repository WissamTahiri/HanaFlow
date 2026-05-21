"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { useGamification, BADGES } from "@/context/GamificationContext";
import { useProgress, SAP_MODULES } from "@/hooks/useProgress";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DECKS } from "@/data/flashcards";
import { countDue, type CardProgress } from "@/lib/sm2";

/**
 * /stats — vue d'ensemble consolidée de la progression de l'utilisateur.
 *
 * Cumule des données venant de :
 *  - DB (certificats via /api/certificates)
 *  - useProgress hook (modules visités, persisté en DB)
 *  - GamificationContext (XP, niveau, badges, streak)
 *  - localStorage (flashcards mastery par deck, drafts CV)
 *
 * Pas de tracking serveur des outils IA pour l'instant — uniquement les
 * données déjà collectées par ailleurs.
 */

type Certificate = {
  id: string;
  moduleCode: string;
  moduleLabel: string;
  examScore: number;
  issuedAt: string;
  revokedAt: string | null;
};

function loadFlashStats(): Record<string, { mastered: number; total: number; due: number }> {
  if (typeof window === "undefined") return {};
  const now = Date.now();
  const out: Record<string, { mastered: number; total: number; due: number }> = {};
  for (const deck of DECKS) {
    let progress: Record<string, CardProgress> = {};
    try {
      const raw = localStorage.getItem(`flashcards:${deck.code}`);
      progress = raw ? JSON.parse(raw) : {};
    } catch {}
    const cardIds = deck.cards.map((c) => c.id);
    const mastered = cardIds.filter((id) => {
      const p = progress[id];
      return p && p.repetitions >= 3 && p.interval >= 7;
    }).length;
    const due = countDue(progress, cardIds, now);
    out[deck.code] = { mastered, total: cardIds.length, due };
  }
  return out;
}

function StatsContent() {
  const { getToken } = useAuth();
  const { xp, earnedBadges, levelInfo, streak } = useGamification();
  const { isVisited, visitedCount, totalModules, percentage, loading: progressLoading } = useProgress();

  const [certs, setCerts] = useState<Certificate[]>([]);
  const [certsLoading, setCertsLoading] = useState(true);
  const [flashStats, setFlashStats] = useState<Record<string, { mastered: number; total: number; due: number }>>({});

  useEffect(() => {
    setFlashStats(loadFlashStats());
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await fetch("/api/certificates", {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setCerts(data.certificates ?? []);
        }
      } finally {
        if (!cancelled) setCertsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const validCerts = certs.filter((c) => !c.revokedAt);
  const totalFlashcardsMastered = Object.values(flashStats).reduce((sum, s) => sum + s.mastered, 0);
  const totalFlashcardsAvailable = Object.values(flashStats).reduce((sum, s) => sum + s.total, 0);
  const totalFlashcardsDue = Object.values(flashStats).reduce((sum, s) => sum + s.due, 0);
  const avgCertScore = validCerts.length > 0
    ? Math.round(validCerts.reduce((sum, c) => sum + c.examScore, 0) / validCerts.length)
    : 0;

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            Tableau de bord progression
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
            Ta progression sur HanaFlow
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Tous tes stats à un endroit : niveau XP, modules explorés, certificats obtenus, cartes maîtrisées.
          </p>
        </div>

        {/* Top stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon="⚡"
            label="Niveau"
            value={levelInfo.current.name}
            sub={`Niv. ${levelInfo.current.level} · ${xp.toLocaleString()} XP`}
            color="from-amber-500 to-amber-600"
          />
          <StatCard
            icon="🏆"
            label="Badges"
            value={`${earnedBadges.length}/${BADGES.length}`}
            sub={`${Math.round((earnedBadges.length / BADGES.length) * 100)} % débloqués`}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            icon="📜"
            label="Certificats"
            value={validCerts.length.toString()}
            sub={validCerts.length > 0 ? `Score moyen ${avgCertScore} %` : certsLoading ? "Chargement…" : "Aucun pour l'instant"}
            color="from-sap-blue to-sap-blue-dark"
          />
          <StatCard
            icon="🔥"
            label="Streak"
            value={streak > 0 ? `${streak} j` : "—"}
            sub={streak > 0 ? "Jours consécutifs" : "Connecte-toi demain"}
            color="from-rose-500 to-rose-600"
          />
        </div>

        {/* Level progress */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Progression niveau
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {levelInfo.current.name}
                {levelInfo.next && (
                  <span className="text-slate-400 font-normal text-sm ml-2">
                    → {levelInfo.next.name}
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-sap-blue dark:text-sap-accent">{levelInfo.progress} %</p>
              {levelInfo.next && (
                <p className="text-[11px] text-slate-500">{levelInfo.xpToNext.toLocaleString()} XP pour passer</p>
              )}
            </div>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-sap-blue to-sap-blue-dark"
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Modules détail */}
        <div className="card p-6 mb-8">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Modules SAP</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            {progressLoading ? "Chargement…" : `${visitedCount} sur ${totalModules} modules explorés (${percentage} %)`}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SAP_MODULES.map((m) => {
              const visited = isVisited(m.slug);
              const cert = validCerts.find((c) => c.moduleCode.toLowerCase() === m.slug);
              const fs = flashStats[m.slug];
              return (
                <div key={m.slug} className="border border-gray-100 dark:border-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`h-7 w-7 rounded-md ${m.color} flex items-center justify-center text-white text-[10px] font-extrabold`}>
                      {m.slug.toUpperCase()}
                    </span>
                    {cert && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold uppercase tracking-wider">
                        Certifié {cert.examScore}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{m.label}</p>
                  <div className="space-y-1.5 text-[11px]">
                    <Row label="Cours visité" value={visited ? "✓" : "—"} good={visited} />
                    {fs && (
                      <Row
                        label="Flashcards maîtrisées"
                        value={`${fs.mastered}/${fs.total}`}
                        good={fs.mastered === fs.total && fs.total > 0}
                      />
                    )}
                    {fs && fs.due > 0 && (
                      <Row label="À réviser" value={`${fs.due}`} accent />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flashcards summary */}
        {totalFlashcardsAvailable > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Flashcards</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cartes maîtrisées sur l&apos;ensemble des 6 decks SAP
                </p>
              </div>
              <Link href="/flashcards" className="btn-outline px-4 py-2 text-sm self-start">
                Voir tous les decks
              </Link>
            </div>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-3xl font-extrabold text-sap-blue dark:text-sap-accent">{totalFlashcardsMastered}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/ {totalFlashcardsAvailable} cartes</span>
              {totalFlashcardsDue > 0 && (
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-md bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent">
                  {totalFlashcardsDue} à réviser maintenant
                </span>
              )}
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${totalFlashcardsAvailable > 0 ? (totalFlashcardsMastered / totalFlashcardsAvailable) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Certificats */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Certificats HanaFlow</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vérifiables publiquement via leur ID unique
              </p>
            </div>
            <Link href="/certificats" className="btn-outline px-4 py-2 text-sm self-start">
              Gérer mes certificats
            </Link>
          </div>
          {certsLoading ? (
            <p className="text-sm text-slate-400">Chargement…</p>
          ) : validCerts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Aucun certificat pour l&apos;instant.
              </p>
              <Link href="/certifications" className="text-sm text-sap-blue dark:text-sap-accent font-semibold hover:underline">
                Passer un simulateur d&apos;examen →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {validCerts.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.moduleLabel}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(c.issuedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      <span className="mx-1.5">·</span>
                      Score {c.examScore} %
                    </p>
                  </div>
                  <Link
                    href={`/verifier-certificat/${c.id}`}
                    className="text-xs text-sap-blue dark:text-sap-accent font-semibold hover:underline shrink-0"
                  >
                    Page publique →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Achievements */}
        <div className="card p-6 sm:p-8 bg-linear-to-br from-amber-500 to-orange-600 text-white text-center border-0">
          <h2 className="text-xl font-bold mb-1">Voir tous tes achievements</h2>
          <p className="text-amber-50 text-sm mb-4 max-w-md mx-auto">
            {earnedBadges.length} badges débloqués · Catégories : démarrage, certifs, quiz, examens, régularité.
          </p>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-amber-700 font-bold hover:bg-amber-50 transition-colors active:scale-[0.98]"
          >
            Voir mes badges →
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-4 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xl bg-linear-to-br ${color} bg-clip-text text-transparent`}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-xl font-extrabold text-slate-900 dark:text-white truncate">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{sub}</p>}
    </motion.div>
  );
}

function Row({ label, value, good, accent }: { label: string; value: string; good?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <span
        className={`font-semibold ${
          good
            ? "text-emerald-600 dark:text-emerald-400"
            : accent
              ? "text-sap-blue dark:text-sap-accent"
              : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function StatsPage() {
  return (
    <ProtectedRoute>
      <StatsContent />
    </ProtectedRoute>
  );
}
