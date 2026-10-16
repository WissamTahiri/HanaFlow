import { describe, it, expect, beforeEach, vi } from "vitest";

// "server-only" n'est un no-op que via le bundler Next.js — pas un package
// npm installé. On le mocke pour pouvoir importer le module sous Vitest (Node).
vi.mock("server-only", () => ({}));

// Mock Prisma en répliquant le pattern de apiHelpers.test.ts : le module
// expose un `tx` factice (userGamification/userProgress/user) injecté dans
// le callback passé à `$transaction`, pour isoler la logique métier pure de
// toute vraie base de données.
const upsertMock = vi.fn();
const updateMock = vi.fn();
const userProgressCountMock = vi.fn();
const userFindUniqueMock = vi.fn();
const transactionMock = vi.fn();

vi.mock("./prisma", () => ({
  prisma: {
    $transaction: (...args: unknown[]) => transactionMock(...args),
  },
}));

import { applyGamificationEvent } from "./gamificationServer";

type Row = {
  totalXp: number;
  badges: string[];
  streakCurrent: number;
  streakBest: number;
  quizPassCount: number;
  lastActivityAt: Date | null;
  lessonProgress: Record<string, number>;
  quizXpCredited: Record<string, number>;
  passedQuizChapters: string[];
  examXpCredited: Record<string, number>;
};

const DAY_MS = 86_400_000;

function baseRow(overrides: Partial<Row> = {}): Row {
  return {
    totalXp: 0,
    badges: [],
    streakCurrent: 0,
    streakBest: 0,
    quizPassCount: 0,
    lastActivityAt: null,
    lessonProgress: {},
    quizXpCredited: {},
    passedQuizChapters: [],
    examXpCredited: {},
    ...overrides,
  };
}

/**
 * Prépare le mock `tx` pour un run : `upsert` renvoie l'état de départ,
 * `update` calcule le nouvel état comme le ferait Prisma (increment, etc.)
 * pour permettre des assertions sur la valeur finale.
 */
function setupTx(row: Row) {
  upsertMock.mockResolvedValue(row);
  updateMock.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
    const increment = (data.totalXp as { increment?: number } | undefined)?.increment ?? 0;
    return {
      totalXp: row.totalXp + increment,
      badges: data.badges ?? row.badges,
      streakCurrent: data.streakCurrent ?? row.streakCurrent,
      streakBest: data.streakBest ?? row.streakBest,
      quizPassCount: data.quizPassCount ?? row.quizPassCount,
      lastActivityAt: (data.lastActivityAt as Date | null | undefined) ?? row.lastActivityAt,
      lessonProgress: data.lessonProgress ?? row.lessonProgress,
      quizXpCredited: data.quizXpCredited ?? row.quizXpCredited,
      passedQuizChapters: data.passedQuizChapters ?? row.passedQuizChapters,
      examXpCredited: data.examXpCredited ?? row.examXpCredited,
    };
  });

  const tx = {
    userGamification: { upsert: upsertMock, update: updateMock },
    userProgress: { count: userProgressCountMock },
    user: { findUnique: userFindUniqueMock },
  };
  transactionMock.mockImplementation(async (fn: (tx: unknown) => unknown) => fn(tx));
}

beforeEach(() => {
  upsertMock.mockReset();
  updateMock.mockReset();
  userProgressCountMock.mockReset();
  userFindUniqueMock.mockReset();
  transactionMock.mockReset();
});

describe("applyGamificationEvent — lesson_complete (anti-farming)", () => {
  it("credits XP for the first lessonCount reported", async () => {
    setupTx(baseRow());
    const { state } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "fi",
      lessonCount: 2,
    });
    expect(state.totalXp).toBe(2 * 25); // LESSON_XP = 25
  });

  it("credits only the DELTA above the max already-known lessonCount", async () => {
    // badges pré-rempli avec lesson_fi pour isoler le calcul de delta XP du
    // bonus XP du badge (sinon franchir le seuil de 5 leçons l'ajouterait).
    setupTx(baseRow({ lessonProgress: { fi: 3 }, badges: ["lesson_fi"] }));
    const { state } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "fi",
      lessonCount: 5,
    });
    expect(state.totalXp).toBe(2 * 25); // delta = 5-3 = 2 leçons
  });

  it("CRITICAL — credits ZERO XP when the client replays an equal or lower lessonCount", async () => {
    setupTx(baseRow({ lessonProgress: { fi: 5 }, badges: ["lesson_fi"] }));
    const { state } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "fi",
      lessonCount: 5, // rejoue le même événement
    });
    expect(state.totalXp).toBe(0);

    setupTx(baseRow({ lessonProgress: { fi: 5 }, badges: ["lesson_fi"] }));
    const { state: state2 } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "fi",
      lessonCount: 2, // renvoie un compte plus petit (replay/rollback client)
    });
    expect(state2.totalXp).toBe(0);
  });

  it("never lets lessonProgress regress even if a smaller count is sent", async () => {
    setupTx(baseRow({ lessonProgress: { fi: 5 } }));
    await applyGamificationEvent(1, { type: "lesson_complete", module: "fi", lessonCount: 2 });
    const updateCall = updateMock.mock.calls[0][0];
    expect(updateCall.data.lessonProgress).toEqual({ fi: 5 });
  });

  it("awards the module lesson badge once lessonCount reaches 5 for a badge-eligible module", async () => {
    setupTx(baseRow({ lessonProgress: { fi: 4 } }));
    const { newBadges } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "fi",
      lessonCount: 5,
    });
    expect(newBadges).toContain("lesson_fi");
  });

  it("does not re-award an already-earned lesson badge", async () => {
    setupTx(baseRow({ lessonProgress: { fi: 5 }, badges: ["lesson_fi"] }));
    const { newBadges, state } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "fi",
      lessonCount: 6,
    });
    expect(newBadges).not.toContain("lesson_fi");
    // Seul le delta de leçon est crédité, pas l'XP du badge une 2e fois.
    expect(state.totalXp).toBe(1 * 25);
  });

  it("does not award a lesson badge for a module outside the badge list", async () => {
    setupTx(baseRow());
    const { newBadges } = await applyGamificationEvent(1, {
      type: "lesson_complete",
      module: "ai", // pas dans LESSON_BADGE_MODULES (fi/co/mm/sd)
      lessonCount: 10,
    });
    expect(newBadges).not.toContain("lesson_ai");
  });

  it("tracks lessonProgress independently per module", async () => {
    setupTx(baseRow({ lessonProgress: { fi: 5, co: 1 } }));
    await applyGamificationEvent(1, { type: "lesson_complete", module: "co", lessonCount: 3 });
    const updateCall = updateMock.mock.calls[0][0];
    expect(updateCall.data.lessonProgress).toEqual({ fi: 5, co: 3 });
  });
});

describe("applyGamificationEvent — login (streak)", () => {
  it("starts the streak at 1 on first-ever login and awards the welcome badge", async () => {
    setupTx(baseRow({ lastActivityAt: null }));
    const { state, newBadges } = await applyGamificationEvent(1, { type: "login" });
    expect(state.streakCurrent).toBe(1);
    expect(newBadges).toContain("welcome");
  });

  it("does not change the streak or re-award welcome when logging in again the same UTC day", async () => {
    const now = new Date();
    setupTx(baseRow({ lastActivityAt: now, streakCurrent: 4, badges: ["welcome"] }));
    const { state, newBadges } = await applyGamificationEvent(1, { type: "login" });
    expect(state.streakCurrent).toBe(4);
    expect(newBadges).not.toContain("welcome");
  });

  it("increments the streak when the last login was exactly yesterday (UTC)", async () => {
    const yesterday = new Date(Date.now() - DAY_MS);
    setupTx(baseRow({ lastActivityAt: yesterday, streakCurrent: 2, streakBest: 2, badges: ["welcome"] }));
    const { state } = await applyGamificationEvent(1, { type: "login" });
    expect(state.streakCurrent).toBe(3);
    expect(state.streakBest).toBe(3);
  });

  it("resets the streak to 1 when the last login was more than a day ago", async () => {
    const longAgo = new Date(Date.now() - 5 * DAY_MS);
    setupTx(baseRow({ lastActivityAt: longAgo, streakCurrent: 10, streakBest: 10, badges: ["welcome"] }));
    const { state } = await applyGamificationEvent(1, { type: "login" });
    expect(state.streakCurrent).toBe(1);
    expect(state.streakBest).toBe(10); // le record est conservé
  });

  it("awards streak_3 at 3 consecutive days, not before", async () => {
    const yesterday = new Date(Date.now() - DAY_MS);
    setupTx(baseRow({ lastActivityAt: yesterday, streakCurrent: 1, badges: ["welcome"] }));
    const { newBadges, state } = await applyGamificationEvent(1, { type: "login" });
    expect(state.streakCurrent).toBe(2);
    expect(newBadges).not.toContain("streak_3");

    setupTx(baseRow({ lastActivityAt: yesterday, streakCurrent: 2, badges: ["welcome"] }));
    const run2 = await applyGamificationEvent(1, { type: "login" });
    expect(run2.state.streakCurrent).toBe(3);
    expect(run2.newBadges).toContain("streak_3");
  });

  it("awards streak_7 at 7 consecutive days", async () => {
    const yesterday = new Date(Date.now() - DAY_MS);
    setupTx(baseRow({ lastActivityAt: yesterday, streakCurrent: 6, badges: ["welcome", "streak_3"] }));
    const { newBadges, state } = await applyGamificationEvent(1, { type: "login" });
    expect(state.streakCurrent).toBe(7);
    expect(newBadges).toContain("streak_7");
  });
});

describe("applyGamificationEvent — module_visit (vérifié en DB, pas confiance au client)", () => {
  it("awards first_module/explorer/sap_expert based on the real DB count, not client input", async () => {
    setupTx(baseRow());
    userProgressCountMock.mockResolvedValue(1);
    const r1 = await applyGamificationEvent(1, { type: "module_visit" });
    expect(r1.newBadges).toContain("first_module");
    expect(r1.newBadges).not.toContain("explorer");

    setupTx(baseRow({ badges: ["first_module"] }));
    userProgressCountMock.mockResolvedValue(3);
    const r2 = await applyGamificationEvent(1, { type: "module_visit" });
    expect(r2.newBadges).toContain("explorer");

    setupTx(baseRow({ badges: ["first_module", "explorer"] }));
    userProgressCountMock.mockResolvedValue(6);
    const r3 = await applyGamificationEvent(1, { type: "module_visit" });
    expect(r3.newBadges).toContain("sap_expert");
  });
});

describe("applyGamificationEvent — quiz_pass / exam_complete / pro_activated", () => {
  it("awards quizXp(100)=150 + the quiz_perfect badge XP (200) for a 100% quiz", async () => {
    setupTx(baseRow());
    const { state, newBadges } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 });
    expect(newBadges).toContain("quiz_perfect");
    expect(state.totalXp).toBe(150 + 200); // quizXp + badge.xp (badges portent leur propre XP)
  });

  it("awards only quizXp (no badge bonus) once quiz_perfect is already earned", async () => {
    setupTx(baseRow({ badges: ["quiz_perfect"] }));
    const { state, newBadges } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 });
    expect(newBadges).not.toContain("quiz_perfect");
    expect(state.totalXp).toBe(150);
  });

  it("awards the quiz_pass badge on the 3rd passing quiz (>=65%)", async () => {
    setupTx(baseRow({ quizPassCount: 2 }));
    const { newBadges, state } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 70 });
    expect(state.quizPassCount).toBe(3);
    expect(newBadges).toContain("quiz_pass");
  });

  it("anti-farming : replaying the same chapter's quiz does not grant XP again", async () => {
    setupTx(baseRow({ quizXpCredited: { "fi:ch1": 150 }, badges: ["quiz_perfect"] }));
    const { state } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 });
    expect(state.totalXp).toBe(0);
  });

  it("anti-farming : improving a chapter from non-perfect to 100% credits only the delta (150-75)", async () => {
    // quiz_perfect déjà acquis via un autre chapitre, pour isoler le delta de CE chapitre.
    setupTx(baseRow({ quizXpCredited: { "fi:ch1": 75 }, badges: ["quiz_perfect"] }));
    const { state } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 });
    expect(state.totalXp).toBe(75);
  });

  it("anti-farming : a different chapter is tracked independently and still grants full XP", async () => {
    setupTx(baseRow({ quizXpCredited: { "fi:ch1": 150 }, badges: ["quiz_perfect"] }));
    const { state } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch2", scorePct: 100 });
    expect(state.totalXp).toBe(150);
  });

  it("anti-farming : passing the same chapter twice only increments quizPassCount once", async () => {
    setupTx(baseRow({ passedQuizChapters: ["fi:ch1"], quizPassCount: 1, quizXpCredited: { "fi:ch1": 75 } }));
    const { state, newBadges } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 70 });
    expect(state.quizPassCount).toBe(1);
    expect(newBadges).not.toContain("quiz_pass");
  });

  it("awards examXp(passed)=400 + exam_fi badge (300) + exam_pass badge (500) when an exam is passed", async () => {
    setupTx(baseRow());
    const { state, newBadges } = await applyGamificationEvent(1, {
      type: "exam_complete",
      module: "fi",
      passed: true,
    });
    expect(newBadges).toEqual(expect.arrayContaining(["exam_fi", "exam_pass"]));
    expect(state.totalXp).toBe(400 + 300 + 500);
  });

  it("still awards the exam_fi completion badge on a FAILED exam (it rewards finishing, not passing), but never exam_pass", async () => {
    setupTx(baseRow());
    const { state, newBadges } = await applyGamificationEvent(1, {
      type: "exam_complete",
      module: "fi",
      passed: false,
    });
    expect(newBadges).toContain("exam_fi");
    expect(newBadges).not.toContain("exam_pass");
    expect(state.totalXp).toBe(150 + 300); // examXp(false) + exam_fi badge
  });

  it("awards only examXp (no badge bonus) once exam_fi/exam_pass are already earned", async () => {
    setupTx(baseRow({ badges: ["exam_fi", "exam_pass"] }));
    const { state, newBadges } = await applyGamificationEvent(1, {
      type: "exam_complete",
      module: "fi",
      passed: true,
    });
    expect(newBadges).toEqual([]);
    expect(state.totalXp).toBe(400);
  });

  it("anti-farming : replaying the same module's exam does not grant XP again", async () => {
    setupTx(baseRow({ examXpCredited: { fi: 400 }, badges: ["exam_fi", "exam_pass"] }));
    const { state } = await applyGamificationEvent(1, { type: "exam_complete", module: "fi", passed: true });
    expect(state.totalXp).toBe(0);
  });

  it("anti-farming : a failed retry after a passed exam credits no extra XP (tier already at max)", async () => {
    setupTx(baseRow({ examXpCredited: { fi: 400 }, badges: ["exam_fi", "exam_pass"] }));
    const { state } = await applyGamificationEvent(1, { type: "exam_complete", module: "fi", passed: false });
    expect(state.totalXp).toBe(0);
  });

  it("anti-farming : passing after an earlier failed attempt credits the XP delta plus the exam_pass badge (first pass)", async () => {
    setupTx(baseRow({ examXpCredited: { fi: 150 }, badges: ["exam_fi"] }));
    const { state } = await applyGamificationEvent(1, { type: "exam_complete", module: "fi", passed: true });
    expect(state.totalXp).toBe(250 + 500); // tier delta (400-150) + exam_pass badge (première réussite)
  });

  it("anti-farming : a different module is tracked independently and still grants full XP", async () => {
    setupTx(baseRow({ examXpCredited: { fi: 400 } }));
    const { state } = await applyGamificationEvent(1, { type: "exam_complete", module: "co", passed: true });
    expect(state.totalXp).toBe(400 + 300 + 500); // examXp + exam_co badge + exam_pass badge
  });

  it("only awards pro_member when the DB confirms isPro=true (never trusts the client)", async () => {
    setupTx(baseRow());
    userFindUniqueMock.mockResolvedValue({ isPro: false });
    const r1 = await applyGamificationEvent(1, { type: "pro_activated" });
    expect(r1.newBadges).not.toContain("pro_member");

    setupTx(baseRow());
    userFindUniqueMock.mockResolvedValue({ isPro: true });
    const r2 = await applyGamificationEvent(1, { type: "pro_activated" });
    expect(r2.newBadges).toContain("pro_member");
  });
});

describe("applyGamificationEvent — write conflict retry (Serializable P2034)", () => {
  it("retries once on a serializable write conflict and succeeds", async () => {
    const row = baseRow();
    setupTx(row);
    let calls = 0;
    transactionMock.mockImplementation(async (fn: (tx: unknown) => unknown) => {
      calls += 1;
      if (calls === 1) {
        const err = new Error("conflict") as Error & { code: string };
        err.code = "P2034";
        throw err;
      }
      const tx = {
        userGamification: { upsert: upsertMock, update: updateMock },
        userProgress: { count: userProgressCountMock },
        user: { findUnique: userFindUniqueMock },
      };
      return fn(tx);
    });
    const { state } = await applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 });
    expect(calls).toBe(2);
    expect(state.totalXp).toBe(150 + 200); // quizXp + badge quiz_perfect
  });

  it("rethrows a second serializable write conflict instead of retrying forever", async () => {
    transactionMock.mockImplementation(async () => {
      const err = new Error("conflict") as Error & { code: string };
      err.code = "P2034";
      throw err;
    });
    await expect(applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 })).rejects.toThrow("conflict");
  });

  it("rethrows immediately for non-conflict errors (no retry)", async () => {
    let calls = 0;
    transactionMock.mockImplementation(async () => {
      calls += 1;
      throw new Error("boom");
    });
    await expect(applyGamificationEvent(1, { type: "quiz_pass", module: "fi", chapterId: "ch1", scorePct: 100 })).rejects.toThrow("boom");
    expect(calls).toBe(1);
  });
});
