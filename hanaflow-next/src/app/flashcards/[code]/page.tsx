"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { getDeck, type FlashCard } from "@/data/flashcards";
import { newCardProgress, review, sortByPriority, type CardProgress, type Quality } from "@/lib/sm2";
import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProGate from "@/components/ProGate";

/**
 * /flashcards/[code] — session de révision pour un module SAP.
 *
 * - Charge le deck depuis src/data/flashcards.ts
 * - Charge la progression localStorage (`flashcards:<code>`)
 * - Trie les cartes par priorité SM-2 (dues d'abord)
 * - À chaque review, met à jour le progress et passe à la suivante
 * - Session terminée quand toutes les cartes du batch ont été notées
 */

function storageKey(moduleCode: string) {
  return `flashcards:${moduleCode}`;
}

function loadProgress(moduleCode: string): Record<string, CardProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(storageKey(moduleCode));
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveProgress(moduleCode: string, progress: Record<string, CardProgress>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(moduleCode), JSON.stringify(progress));
  } catch {
    // localStorage plein — on accepte
  }
}

const RATINGS: { label: string; quality: Quality; color: string; key: string }[] = [
  { label: "Encore", quality: 0, color: "bg-rose-500 hover:bg-rose-600", key: "1" },
  { label: "Difficile", quality: 3, color: "bg-amber-500 hover:bg-amber-600", key: "2" },
  { label: "Bien", quality: 4, color: "bg-emerald-500 hover:bg-emerald-600", key: "3" },
  { label: "Facile", quality: 5, color: "bg-sap-blue hover:bg-sap-blue-dark", key: "4" },
];

export default function FlashcardSessionPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <ProtectedRoute>
      <ProGate
        featureName="Flashcards SAP Pro"
        featureDescription="Mémorise les T-codes, tables et processus SAP avec un système de spaced repetition (SM-2) qui s'adapte à ce que tu retiens vraiment."
        perks={[
          "6 decks curated : FI, CO, MM, SD, PP, IA générative",
          "Algorithme SM-2 (SuperMemo) — les cartes ratées reviennent, les maîtrisées s'espacent",
          "Sessions de 5 min : T-codes, tables, processus métier, concepts S/4HANA",
          "Progression locale sécurisée (rien n'est envoyé au serveur)",
          "Raccourcis clavier pour réviser à vitesse réelle",
        ]}
      >
        <FlashcardSessionContent params={params} />
      </ProGate>
    </ProtectedRoute>
  );
}

function FlashcardSessionContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const deck = getDeck(code);
  if (!deck) notFound();

  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [orderedCards, setOrderedCards] = useState<FlashCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  // Load progress + compute ordered deck once.
  // setState dans useEffect est nécessaire ici : on bridge localStorage (qui
  // n'existe pas côté SSR) avec React state. L'état évolue ensuite via les
  // actions utilisateur (rate()), donc useSyncExternalStore ne convient pas.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = loadProgress(deck.code);
    setProgress(p);
    setOrderedCards(sortByPriority(deck.cards, p));
    setHasLoaded(true);
  }, [deck]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const current = orderedCards[currentIdx];
  const remaining = orderedCards.length - currentIdx;
  const totalCards = orderedCards.length;

  const rate = (quality: Quality) => {
    if (!current) return;
    const existing = progress[current.id] ?? newCardProgress(current.id);
    const next = review(existing, quality);
    const updated = { ...progress, [current.id]: next };
    setProgress(updated);
    saveProgress(deck.code, updated);

    setSessionStats((s) => ({
      again: s.again + (quality === 0 ? 1 : 0),
      hard: s.hard + (quality === 3 ? 1 : 0),
      good: s.good + (quality === 4 ? 1 : 0),
      easy: s.easy + (quality === 5 ? 1 : 0),
    }));

    setShowBack(false);
    setCurrentIdx((i) => i + 1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!showBack) setShowBack(true);
        return;
      }
      if (!showBack) return;
      const rating = RATINGS.find((r) => r.key === e.key);
      if (rating) rate(rating.quality);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showBack, current]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hasLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-sap-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  // Session done
  if (!current) {
    const total = sessionStats.again + sessionStats.hard + sessionStats.good + sessionStats.easy;
    const goodPct = total > 0 ? Math.round(((sessionStats.good + sessionStats.easy) / total) * 100) : 0;
    return (
      <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-10"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Session terminée</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {total} cartes révisées sur le module {deck.code.toUpperCase()}
            </p>

            <div className="grid grid-cols-4 gap-2 mb-8">
              <Stat label="Encore" value={sessionStats.again} color="text-rose-500" />
              <Stat label="Difficile" value={sessionStats.hard} color="text-amber-500" />
              <Stat label="Bien" value={sessionStats.good} color="text-emerald-500" />
              <Stat label="Facile" value={sessionStats.easy} color="text-sap-blue dark:text-sap-accent" />
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Tu as répondu correctement à <span className="font-bold text-sap-blue dark:text-sap-accent">{goodPct} %</span> des cartes.
              Les cartes ratées reviendront demain, les cartes faciles dans plusieurs jours.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => window.location.reload()} className="btn-primary px-5 py-2.5">
                Refaire une session
              </button>
              <Link href="/flashcards" className="btn-outline px-5 py-2.5">
                Choisir un autre module
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const progressPct = totalCards > 0 ? Math.round((currentIdx / totalCards) * 100) : 0;
  const seenBefore = progress[current.id] !== undefined;

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/flashcards" className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            ← Tous les modules
          </Link>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Module <span className="font-bold text-slate-900 dark:text-white">{deck.code.toUpperCase()}</span>
          </span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Carte {currentIdx + 1} / {totalCards}
            </span>
            <span className="text-slate-400">{remaining} restantes</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-sap-blue transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="card p-8 sm:p-10 min-h-[280px] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-5">
              {current.tags?.map((t) => (
                <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {t}
                </span>
              ))}
              {seenBefore && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent">
                  Déjà vue
                </span>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-3 text-center">
                  Question
                </p>
                <p className="text-xl font-semibold text-slate-900 dark:text-white leading-relaxed text-center text-balance">
                  {current.front}
                </p>

                {showBack && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sap-blue dark:text-sap-accent mb-3 text-center">
                      Réponse
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed text-center">
                      {current.back}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="mt-6">
          {!showBack ? (
            <button
              onClick={() => setShowBack(true)}
              className="w-full btn-primary py-3 text-sm"
            >
              Afficher la réponse <span className="ml-1 text-[10px] opacity-70">(Espace)</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r.label}
                  onClick={() => rate(r.quality)}
                  className={`${r.color} text-white py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.97]`}
                >
                  {r.label} <span className="ml-1 text-[10px] opacity-70">({r.key})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}
