import "server-only";
import { prisma } from "./prisma";
import { getBadge, quizXp, examXp, LESSON_XP } from "./gamification";

/**
 * Logique de gamification côté serveur — source de vérité.
 *
 * Le client n'envoie jamais de montant d'XP : il déclare un ÉVÉNEMENT
 * (login, quiz réussi, examen terminé…) et le serveur applique des règles
 * fixes. Les badges liés aux visites de modules sont recomptés depuis la
 * table user_progress, pas depuis ce que prétend le client.
 */

export type GamificationState = {
  totalXp: number;
  badges: string[];
  streakCurrent: number;
  streakBest: number;
  quizPassCount: number;
};

export type GamificationEvent =
  | { type: "login" }
  | { type: "module_visit" }
  | { type: "lesson_complete"; module: string; lessonCount: number }
  | { type: "quiz_pass"; scorePct: number }
  | { type: "exam_complete"; module: string; passed: boolean }
  | { type: "pro_activated" };

const LESSON_BADGE_MODULES = ["fi", "co", "mm", "sd"];
const EXAM_BADGE_MODULES = ["fi", "co", "mm", "sd"];

type Row = {
  totalXp: number;
  badges: unknown;
  streakCurrent: number;
  streakBest: number;
  quizPassCount: number;
  lastActivityAt: Date | null;
  lessonProgress: unknown;
};

function toState(row: Row): GamificationState & { lastActivityAt: Date | null } {
  return {
    totalXp: row.totalXp,
    badges: Array.isArray(row.badges) ? (row.badges as string[]) : [],
    streakCurrent: row.streakCurrent,
    streakBest: row.streakBest,
    quizPassCount: row.quizPassCount,
    lastActivityAt: row.lastActivityAt,
  };
}

/** Extrait un `{module: count}` sûr depuis le JSON stocké en base. */
function toLessonProgress(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

export async function getGamification(userId: number) {
  const row = await prisma.userGamification.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  return toState(row);
}

/** Jour UTC (YYYY-MM-DD) d'une date — pour comparer les streaks. */
const utcDay = (d: Date) => d.toISOString().slice(0, 10);

/** Client de transaction Prisma (sous-ensemble utilisé ici). */
type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/** Conflit d'écriture / deadlock sérialisable → rejouable une fois. */
function isWriteConflict(e: unknown): boolean {
  return !!e && typeof e === "object" && (e as { code?: string }).code === "P2034";
}

/**
 * Applique un événement et persiste. Renvoie l'état à jour + les badges
 * nouvellement gagnés (pour la notification client).
 *
 * Le read (état courant) et le write sont exécutés dans UNE transaction
 * SERIALIZABLE : sans ça, deux événements concurrents du même user peuvent
 * lire le même `badges` avant d'écrire, décerner deux fois l'XP d'un badge qui
 * n'apparaît qu'une fois → total XP incohérent et non réconciliable. En cas de
 * conflit d'écriture (P2034), on rejoue une seule fois.
 */
export async function applyGamificationEvent(userId: number, event: GamificationEvent) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(
        (tx) => runGamificationEvent(tx, userId, event),
        { isolationLevel: "Serializable" },
      );
    } catch (e) {
      if (attempt === 0 && isWriteConflict(e)) continue;
      throw e;
    }
  }
}

async function runGamificationEvent(tx: Tx, userId: number, event: GamificationEvent) {
  const existingRow = await tx.userGamification.upsert({ where: { userId }, create: { userId }, update: {} });
  const current = toState(existingRow);
  const badges = new Set(current.badges);
  const newBadges: string[] = [];
  let xpDelta = 0;
  let { streakCurrent, streakBest, quizPassCount } = current;
  let lastActivityAt = current.lastActivityAt;
  const lessonProgress = toLessonProgress(existingRow.lessonProgress);

  const award = (id: string) => {
    if (badges.has(id)) return;
    const badge = getBadge(id);
    if (!badge) return;
    badges.add(id);
    newBadges.push(id);
    xpDelta += badge.xp;
  };

  switch (event.type) {
    case "login": {
      award("welcome");
      const today = utcDay(new Date());
      const last = lastActivityAt ? utcDay(lastActivityAt) : null;
      if (last !== today) {
        const yesterday = utcDay(new Date(Date.now() - 86400000));
        streakCurrent = last === yesterday ? streakCurrent + 1 : 1;
        streakBest = Math.max(streakBest, streakCurrent);
        lastActivityAt = new Date();
        if (streakCurrent >= 7) award("streak_7");
        else if (streakCurrent >= 3) award("streak_3");
      }
      break;
    }
    case "module_visit": {
      // Vérifiable en DB : on recompte les modules réellement visités.
      const visited = await tx.userProgress.count({ where: { userId } });
      if (visited >= 1) award("first_module");
      if (visited >= 3) award("explorer");
      if (visited >= 6) award("sap_expert");
      break;
    }
    case "lesson_complete": {
      // Anti-farming : on ne crédite que le delta au-dessus du plus haut
      // lessonCount déjà connu pour ce module. Un client qui rejoue le même
      // (ou un plus petit) lessonCount ne gagne plus d'XP.
      const prevCount = lessonProgress[event.module] ?? 0;
      const newCount = Math.max(prevCount, event.lessonCount);
      const delta = newCount - prevCount;
      if (delta > 0) {
        xpDelta += delta * LESSON_XP;
        lessonProgress[event.module] = newCount;
      }
      if (newCount >= 5 && LESSON_BADGE_MODULES.includes(event.module)) {
        award(`lesson_${event.module}`);
      }
      break;
    }
    case "quiz_pass": {
      xpDelta += quizXp(event.scorePct);
      if (event.scorePct === 100) award("quiz_perfect");
      if (event.scorePct >= 65) {
        quizPassCount += 1;
        if (quizPassCount >= 3) award("quiz_pass");
      }
      break;
    }
    case "exam_complete": {
      xpDelta += examXp(event.passed);
      if (EXAM_BADGE_MODULES.includes(event.module)) award(`exam_${event.module}`);
      if (event.passed) award("exam_pass");
      break;
    }
    case "pro_activated": {
      // On ne croit pas le client : vérification du flag en DB.
      const user = await tx.user.findUnique({ where: { id: userId }, select: { isPro: true } });
      if (user?.isPro) award("pro_member");
      break;
    }
  }

  const row = await tx.userGamification.update({
    where: { userId },
    data: {
      totalXp: { increment: xpDelta },
      badges: [...badges],
      streakCurrent,
      streakBest,
      quizPassCount,
      lastActivityAt,
      lessonProgress,
    },
  });

  return { state: toState(row), newBadges };
}
