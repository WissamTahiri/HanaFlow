"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { DECKS } from "@/data/flashcards";
import { countDue, type CardProgress } from "@/lib/sm2";

/**
 * /flashcards — picker de modules avec stats de révision par deck.
 *
 * Affiche pour chaque module : nombre de cartes dues, % maîtrisé.
 * Le détail des sessions tourne sur /flashcards/[code].
 *
 * Patte client-only : on lit localStorage via useSyncExternalStore pour
 * éviter la mismatch d'hydration et satisfaire le linter React 19 qui
 * interdit setState dans useEffect pour le sync d'external store.
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

type DeckStats = Record<string, { due: number; mastered: number; total: number }>;

const EMPTY_STATS: DeckStats = Object.fromEntries(
  DECKS.map((d) => [d.code, { due: d.cards.length, mastered: 0, total: d.cards.length }]),
);

function subscribeStorage(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

let cachedStats: DeckStats | null = null;
let cachedKey = "";

function getClientStats(): DeckStats {
  if (typeof window === "undefined") return EMPTY_STATS;
  // Cache pour éviter de recalculer à chaque appel de useSyncExternalStore
  // (ce qui pourrait causer une boucle infinie de re-render).
  // On régénère seulement si une clé localStorage flashcards:* a changé.
  const key = DECKS.map((d) => localStorage.getItem(storageKey(d.code)) ?? "").join("|");
  if (cachedStats && key === cachedKey) return cachedStats;
  const now = Date.now();
  const out: DeckStats = {};
  for (const deck of DECKS) {
    const progress = loadProgress(deck.code);
    const cardIds = deck.cards.map((c) => c.id);
    const due = countDue(progress, cardIds, now);
    const mastered = cardIds.filter((id) => {
      const p = progress[id];
      return p && p.repetitions >= 3 && p.interval >= 7;
    }).length;
    out[deck.code] = { due, mastered, total: cardIds.length };
  }
  cachedStats = out;
  cachedKey = key;
  return out;
}

export default function FlashcardsPage() {
  const stats = useSyncExternalStore(subscribeStorage, getClientStats, () => EMPTY_STATS);

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            Flashcards SAP · Spaced repetition
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
            Mémorise les concepts SAP qui tombent en certif
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            T-codes, tables, processus métier — révisés en 5 min par jour avec l&apos;algorithme SM-2 (SuperMemo).
            L&apos;app espace automatiquement les cartes selon ce que tu retiens vraiment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DECKS.map((deck, i) => {
            const s = stats[deck.code];
            const masteredPct = s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0;
            return (
              <motion.div
                key={deck.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={`/flashcards/${deck.code}`}
                  className="block card p-6 hover:shadow-medium hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`h-10 w-10 rounded-xl bg-linear-to-br ${deck.color} flex items-center justify-center text-white font-extrabold text-xs`}>
                      {deck.code.toUpperCase()}
                    </span>
                    {s.due > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sap-blue text-white">
                        {s.due} à réviser
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1">{deck.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{deck.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span>{s.mastered} / {s.total} maîtrisées</span>
                      <span>{masteredPct} %</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-linear-to-r ${deck.color} transition-all duration-500`}
                        style={{ width: `${masteredPct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong>Comment ça marche :</strong> chaque carte est notée 4 niveaux après ta réponse (Encore, Difficile, Bien, Facile).
            L&apos;intervalle de révision s&apos;adapte automatiquement — les concepts maîtrisés reviennent rarement,
            les autres reviennent vite. Aucune donnée envoyée au serveur — tout vit dans ton navigateur.
          </p>
        </div>
      </div>
    </div>
  );
}
