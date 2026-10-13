import { describe, it, expect } from "vitest";
import {
  review,
  isDue,
  countDue,
  sortByPriority,
  newCardProgress,
  type CardProgress,
  type Quality,
} from "./sm2";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("newCardProgress", () => {
  it("creates an initial state due immediately with default ease factor", () => {
    const now = Date.now();
    const card = newCardProgress("card-1");
    expect(card.cardId).toBe("card-1");
    expect(card.repetitions).toBe(0);
    expect(card.easeFactor).toBe(2.5);
    expect(card.interval).toBe(0);
    expect(card.lastReviewAt).toBe(0);
    expect(card.nextReviewAt).toBeGreaterThanOrEqual(now);
    expect(isDue(card, card.nextReviewAt)).toBe(true);
  });
});

describe("review — quality < 3 (échec)", () => {
  it("resets repetitions and interval to 1 day regardless of prior state", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 5,
      easeFactor: 2.3,
      interval: 40,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const now = Date.now();
    const next = review(card, 0, now);
    expect(next.repetitions).toBe(0);
    expect(next.interval).toBe(1);
    expect(next.nextReviewAt).toBe(now + 1 * DAY_MS);
    expect(next.lastReviewAt).toBe(now);
  });

  it("does not change easeFactor on failure", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 2,
      easeFactor: 2.1,
      interval: 6,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const next = review(card, 0, 1000);
    expect(next.easeFactor).toBe(2.1);
  });

  it("resets a card after a long streak of successes (quality drops to 0)", () => {
    let card = newCardProgress("c");
    const now = 1_000_000;
    // Build up a long streak of "Easy" reviews.
    for (let i = 0; i < 6; i++) {
      card = review(card, 5, now + i * DAY_MS);
    }
    expect(card.repetitions).toBe(6);
    expect(card.interval).toBeGreaterThan(6);

    // One failure wipes it all out.
    const afterFail = review(card, 0, now + 7 * DAY_MS);
    expect(afterFail.repetitions).toBe(0);
    expect(afterFail.interval).toBe(1);
    // easeFactor is untouched by a failure (only quality>=3 updates it).
    expect(afterFail.easeFactor).toBe(card.easeFactor);
  });
});

describe("review — quality >= 3 (succès)", () => {
  it("first success (repetitions 0→1): interval = 1 day", () => {
    const card = newCardProgress("c");
    const now = 1000;
    const next = review(card, 4, now);
    expect(next.repetitions).toBe(1);
    expect(next.interval).toBe(1);
    expect(next.nextReviewAt).toBe(now + DAY_MS);
  });

  it("second success (repetitions 1→2): interval = 6 days", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 1,
      easeFactor: 2.5,
      interval: 1,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const next = review(card, 4, 1000);
    expect(next.repetitions).toBe(2);
    expect(next.interval).toBe(6);
  });

  it("third+ success (repetitions 2→3): interval = round(interval * easeFactor)", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const next = review(card, 4, 1000);
    expect(next.repetitions).toBe(3);
    // 6 * (2.5 + delta_ef_for_q4) — easeFactor is updated to compute the
    // interval only AFTER interval calc per algorithm order in source:
    // actual implementation computes interval BEFORE updating easeFactor,
    // using the OLD easeFactor.
    expect(next.interval).toBe(Math.round(6 * 2.5));
  });

  it("computes the easeFactor delta with the SM-2 formula for each quality", () => {
    const base: CardProgress = {
      cardId: "c",
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const qualities: Quality[] = [3, 4, 5];
    for (const q of qualities) {
      const next = review(base, q, 1000);
      const expectedEf =
        Math.round((2.5 + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))) * 100) / 100;
      expect(next.easeFactor).toBe(expectedEf);
    }
  });

  it("quality=5 (Easy) increases easeFactor", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const next = review(card, 5, 1000);
    expect(next.easeFactor).toBeGreaterThan(2.5);
  });

  it("quality=3 (Hard) decreases easeFactor", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const next = review(card, 3, 1000);
    expect(next.easeFactor).toBeLessThan(2.5);
  });

  it("easeFactor never drops below MIN_EF (1.3) even with repeated quality=3", () => {
    let card = newCardProgress("c");
    let now = 0;
    // Drive repetitions up first so quality>=3 branch keeps running.
    for (let i = 0; i < 50; i++) {
      now += DAY_MS;
      card = review(card, 3, now);
      expect(card.easeFactor).toBeGreaterThanOrEqual(1.3);
    }
    // Should have bottomed out at the floor.
    expect(card.easeFactor).toBe(1.3);
  });

  it("sets nextReviewAt = now + interval * DAY_MS", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 3,
      easeFactor: 2.0,
      interval: 10,
      nextReviewAt: 0,
      lastReviewAt: 0,
    };
    const now = 500_000;
    const next = review(card, 4, now);
    expect(next.nextReviewAt).toBe(now + next.interval * DAY_MS);
  });

  it("does not mutate the input card (pure function)", () => {
    const card: CardProgress = {
      cardId: "c",
      repetitions: 2,
      easeFactor: 2.5,
      interval: 6,
      nextReviewAt: 123,
      lastReviewAt: 0,
    };
    const snapshot = { ...card };
    review(card, 4, 1000);
    expect(card).toEqual(snapshot);
  });
});

describe("isDue", () => {
  it("is due when nextReviewAt is in the past or now", () => {
    const card = { ...newCardProgress("c"), nextReviewAt: 1000 };
    expect(isDue(card, 1000)).toBe(true);
    expect(isDue(card, 1001)).toBe(true);
  });

  it("is not due when nextReviewAt is in the future", () => {
    const card = { ...newCardProgress("c"), nextReviewAt: 2000 };
    expect(isDue(card, 1000)).toBe(false);
  });
});

describe("countDue", () => {
  it("counts cards never seen as due", () => {
    expect(countDue({}, ["a", "b", "c"], 1000)).toBe(3);
  });

  it("counts a mix of due and not-due cards", () => {
    const progress: Record<string, CardProgress> = {
      a: { ...newCardProgress("a"), nextReviewAt: 500 }, // due
      b: { ...newCardProgress("b"), nextReviewAt: 5000 }, // not due
    };
    expect(countDue(progress, ["a", "b", "c"], 1000)).toBe(2); // a (due) + c (never seen)
  });

  it("returns 0 when nothing is due", () => {
    const progress: Record<string, CardProgress> = {
      a: { ...newCardProgress("a"), nextReviewAt: 5000 },
    };
    expect(countDue(progress, ["a"], 1000)).toBe(0);
  });
});

describe("sortByPriority", () => {
  it("puts due cards before non-due cards", () => {
    const cards = [{ id: "not-due" }, { id: "due" }];
    const progress: Record<string, CardProgress> = {
      "not-due": { ...newCardProgress("not-due"), nextReviewAt: 5000 },
      due: { ...newCardProgress("due"), nextReviewAt: 500 },
    };
    const sorted = sortByPriority(cards, progress, 1000);
    expect(sorted.map((c) => c.id)).toEqual(["due", "not-due"]);
  });

  it("treats never-seen cards as due", () => {
    const cards = [{ id: "seen-not-due" }, { id: "never-seen" }];
    const progress: Record<string, CardProgress> = {
      "seen-not-due": { ...newCardProgress("seen-not-due"), nextReviewAt: 5000 },
    };
    const sorted = sortByPriority(cards, progress, 1000);
    expect(sorted.map((c) => c.id)).toEqual(["never-seen", "seen-not-due"]);
  });

  it("among due cards, orders by oldest nextReviewAt first", () => {
    const cards = [{ id: "recent" }, { id: "oldest" }, { id: "middle" }];
    const progress: Record<string, CardProgress> = {
      recent: { ...newCardProgress("recent"), nextReviewAt: 900 },
      oldest: { ...newCardProgress("oldest"), nextReviewAt: 100 },
      middle: { ...newCardProgress("middle"), nextReviewAt: 500 },
    };
    const sorted = sortByPriority(cards, progress, 1000);
    expect(sorted.map((c) => c.id)).toEqual(["oldest", "middle", "recent"]);
  });

  it("does not mutate the input array", () => {
    const cards = [{ id: "a" }, { id: "b" }];
    const copy = [...cards];
    sortByPriority(cards, {}, 1000);
    expect(cards).toEqual(copy);
  });
});
