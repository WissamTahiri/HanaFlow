import { describe, it, expect } from "vitest";
import { getLevelInfo, getBadge, quizXp, examXp, LEVELS, BADGES } from "./gamification";

describe("getLevelInfo", () => {
  it("returns level 1 (Débutant) for xp = 0", () => {
    const info = getLevelInfo(0);
    expect(info.current.level).toBe(1);
    expect(info.current.name).toBe("Débutant");
    expect(info.next?.level).toBe(2);
    expect(info.xpInLevel).toBe(0);
    expect(info.xpToNext).toBe(200);
    expect(info.progress).toBe(0);
  });

  it("returns exactly the next level when xp hits its minXP boundary", () => {
    const info = getLevelInfo(200); // minXP du niveau 2
    expect(info.current.level).toBe(2);
    expect(info.current.name).toBe("Initié");
    expect(info.next?.level).toBe(3);
    expect(info.xpInLevel).toBe(0);
  });

  it("computes progress/xpInLevel/xpToNext mid-level", () => {
    // Niveau 2 (Initié, 200) → Niveau 3 (Apprenti, 500), span = 300
    const info = getLevelInfo(350);
    expect(info.current.level).toBe(2);
    expect(info.next?.level).toBe(3);
    expect(info.xpInLevel).toBe(150);
    expect(info.xpToNext).toBe(150);
    expect(info.progress).toBe(50); // 150/300 = 50%
  });

  it("is correct at every level boundary", () => {
    for (let i = 0; i < LEVELS.length; i++) {
      const info = getLevelInfo(LEVELS[i].minXP);
      expect(info.current.level).toBe(LEVELS[i].level);
      expect(info.xpInLevel).toBe(0);
      if (i < LEVELS.length - 1) {
        expect(info.next?.level).toBe(LEVELS[i + 1].level);
        expect(info.progress).toBe(0);
      } else {
        // Dernier niveau : pas de "next", progress conventionnellement à 100.
        expect(info.next).toBeNull();
        expect(info.progress).toBe(100);
      }
    }
  });

  it("just below a boundary stays in the previous level", () => {
    const info = getLevelInfo(199);
    expect(info.current.level).toBe(1);
    expect(info.next?.level).toBe(2);
  });

  it("caps at the last level: progress=100, next=null, xpToNext=0", () => {
    const lastLevel = LEVELS[LEVELS.length - 1];
    const info = getLevelInfo(lastLevel.minXP + 50_000);
    expect(info.current.level).toBe(lastLevel.level);
    expect(info.current.name).toBe(lastLevel.name);
    expect(info.next).toBeNull();
    expect(info.progress).toBe(100);
    expect(info.xpToNext).toBe(0);
    expect(info.xpInLevel).toBe(50_000);
  });

  it("handles negative/invalid xp gracefully by falling back to level 1", () => {
    const info = getLevelInfo(-100);
    expect(info.current.level).toBe(1);
  });
});

describe("getBadge", () => {
  it("finds an existing badge by id", () => {
    const badge = getBadge("welcome");
    expect(badge).toBeDefined();
    expect(badge?.name).toBe("Bienvenue !");
  });

  it("returns undefined for an unknown badge id", () => {
    expect(getBadge("does_not_exist")).toBeUndefined();
  });

  it("every badge in the catalog is findable by its own id", () => {
    for (const b of BADGES) {
      expect(getBadge(b.id)).toEqual(b);
    }
  });
});

describe("quizXp", () => {
  it("awards 150 XP for a perfect score (100)", () => {
    expect(quizXp(100)).toBe(150);
  });

  it("awards 75 XP for any non-perfect score", () => {
    expect(quizXp(99)).toBe(75);
    expect(quizXp(65)).toBe(75);
    expect(quizXp(0)).toBe(75);
  });
});

describe("examXp", () => {
  it("awards 400 XP when passed", () => {
    expect(examXp(true)).toBe(400);
  });

  it("awards 150 XP when failed", () => {
    expect(examXp(false)).toBe(150);
  });
});
