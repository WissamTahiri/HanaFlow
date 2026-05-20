/**
 * SM-2 spaced repetition algorithm (SuperMemo 2).
 *
 * Référence : https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 *
 * Mapping bouton UI → quality :
 *   "Again" → 0   (raté, reset à 1 jour)
 *   "Hard"  → 3   (réponse correcte mais difficile)
 *   "Good"  → 4   (réponse correcte avec un peu d'hésitation)
 *   "Easy"  → 5   (réponse immédiate, parfaite)
 *
 * Quality < 3 → repetitions remis à 0, interval = 1 jour.
 * Quality ≥ 3 → progression normale du calendrier de révision.
 */

export type Quality = 0 | 3 | 4 | 5;

export type CardProgress = {
  /** Carte ID — référence stable côté deck */
  cardId: string;
  /** Nombre de répétitions réussies consécutives */
  repetitions: number;
  /** Facteur de facilité (entre 1.3 et 2.5+, par défaut 2.5) */
  easeFactor: number;
  /** Intervalle actuel en jours */
  interval: number;
  /** Timestamp de la prochaine révision (ms) */
  nextReviewAt: number;
  /** Timestamp de la dernière révision (ms) — utile pour stats */
  lastReviewAt: number;
};

const MIN_EF = 1.3;
const DEFAULT_EF = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

export function newCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    repetitions: 0,
    easeFactor: DEFAULT_EF,
    interval: 0,
    nextReviewAt: Date.now(), // immédiatement due
    lastReviewAt: 0,
  };
}

/**
 * Calcule le prochain état d'une carte selon le rating SM-2.
 * Pure function — pas de mutation, retourne un nouvel objet.
 */
export function review(card: CardProgress, quality: Quality, now: number = Date.now()): CardProgress {
  let { repetitions, easeFactor, interval } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < MIN_EF) easeFactor = MIN_EF;
  }

  return {
    cardId: card.cardId,
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    lastReviewAt: now,
    nextReviewAt: now + interval * DAY_MS,
  };
}

export function isDue(card: CardProgress, now: number = Date.now()): boolean {
  return card.nextReviewAt <= now;
}

/** Compte les cartes dues maintenant dans un deck. */
export function countDue(progress: Record<string, CardProgress>, cardIds: string[], now: number = Date.now()): number {
  return cardIds.filter((id) => {
    const p = progress[id];
    if (!p) return true; // jamais vue = due
    return isDue(p, now);
  }).length;
}

/** Trie les cartes par priorité de révision : dues en premier (les plus anciennes en tête). */
export function sortByPriority<C extends { id: string }>(
  cards: C[],
  progress: Record<string, CardProgress>,
  now: number = Date.now(),
): C[] {
  return [...cards].sort((a, b) => {
    const pa = progress[a.id];
    const pb = progress[b.id];
    const aDue = !pa || isDue(pa, now);
    const bDue = !pb || isDue(pb, now);
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;
    // Les deux dues : la plus ancienne en premier
    const aTime = pa?.nextReviewAt ?? 0;
    const bTime = pb?.nextReviewAt ?? 0;
    return aTime - bTime;
  });
}
