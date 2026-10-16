import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, ok, err, rateLimit, validateBody } from "@/lib/apiHelpers";
import { applyGamificationEvent } from "@/lib/gamificationServer";
import { getChapterQuiz, getExamQuestions, isPremiumChapter, isValidModule, type CanonicalQuestion } from "@/lib/certAccess";

/**
 * POST /api/quiz/submit — enregistre une tentative de quiz de chapitre ou de
 * simulateur d'examen, puis applique l'événement de gamification associé
 * (XP + badges) côté serveur. Une seule requête depuis le client.
 *
 * Le score n'est JAMAIS accepté depuis le client : il est recalculé ici à
 * partir de la banque de questions officielle (cf. lib/certAccess) et des
 * réponses soumises. Ça évite qu'un client forge une tentative "réussie"
 * sans avoir répondu à une seule question — cette tentative est ensuite le
 * seul contrôle anti-fraude utilisé par /api/certificates/issue.
 */

const inputSchema = z.object({
  moduleCode: z.enum(["fi", "co", "mm", "sd", "pp", "ai"]),
  kind: z.enum(["quiz", "exam"]),
  /** ID du chapitre pour kind=quiz (ex: "ch3"). */
  chapterId: z.string().max(20).optional(),
  /** Réponses soumises, dans l'ordre des questions affichées au candidat. */
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1).max(40),
        selectedIndex: z.number().int().min(0).max(9).nullable(),
      }),
    )
    .min(1)
    .max(200),
});

function gradeAnswers(
  canonical: CanonicalQuestion[],
  submitted: { questionId: string; selectedIndex: number | null }[],
) {
  const selectedByQuestionId = new Map(submitted.map((a) => [a.questionId, a.selectedIndex]));
  let correct = 0;
  // Corrigé + explications une fois la tentative déjà notée : sûr à renvoyer
  // au client (il ne peut plus s'en servir pour changer le score de CETTE
  // tentative, déjà enregistrée en base). Sert à l'écran de révision.
  const correctAnswers: Record<string, number> = {};
  const explanations: Record<string, string> = {};
  canonical.forEach((q, i) => {
    const questionId = q.id !== undefined ? String(q.id) : String(i);
    correctAnswers[questionId] = q.correctIndex;
    if (q.explanation) explanations[questionId] = q.explanation;
    if (selectedByQuestionId.get(questionId) === q.correctIndex) correct++;
  });
  const questionsTotal = canonical.length;
  const score = questionsTotal > 0 ? Math.round((correct / questionsTotal) * 100) : 0;
  return { score, questionsTotal, correctAnswers, explanations };
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("status" in auth) return auth;

  if (!(await rateLimit(`quiz-submit:${auth.user.userId}`, 60, 60 * 60 * 1000))) {
    return err("Trop de soumissions, réessaie plus tard.", 429);
  }

  const body = await req.json().catch(() => null);
  const validated = validateBody(inputSchema, body);
  if (!validated.success) return err(validated.error, 400);
  const { moduleCode, kind, chapterId, answers } = validated.data;

  if (!isValidModule(moduleCode)) return err("Module SAP inconnu.", 400);

  // Gate Pro : l'examen complet est toujours Pro ; un quiz de chapitre ne
  // l'est que si CE chapitre est premium. Sans ce check, un compte gratuit
  // pouvait appeler cette route directement (hors UI) pour obtenir une
  // tentative d'examen "réussie" côté serveur, puis un vrai certificat via
  // /api/certificates/issue — contournement total du paywall Pro.
  const needsPro = kind === "exam" || (!!chapterId && isPremiumChapter(moduleCode, chapterId));
  let userIsPro = auth.user.role === "admin";
  if (needsPro && !userIsPro) {
    const dbUser = await prisma.user.findUnique({
      where: { id: auth.user.userId },
      select: { isPro: true },
    });
    userIsPro = !!dbUser?.isPro;
    if (!userIsPro) {
      return err("Cette fonctionnalité est réservée aux membres Pro.", 402);
    }
  }

  let canonical: CanonicalQuestion[] | null;
  if (kind === "exam") {
    canonical = getExamQuestions(moduleCode);
  } else {
    if (!chapterId) return err("chapterId requis pour un quiz de chapitre.", 400);
    canonical = getChapterQuiz(moduleCode, chapterId, userIsPro);
  }
  if (!canonical || canonical.length === 0) {
    return err("Questions introuvables pour ce module/chapitre.", 400);
  }

  const { score, questionsTotal, correctAnswers, explanations } = gradeAnswers(canonical, answers);

  const attempt = await prisma.quizAttempt.create({
    data: { userId: auth.user.userId, moduleCode, kind, chapterId: chapterId ?? null, score, questionsTotal },
    select: { id: true, attemptedAt: true },
  });

  const { state, newBadges } = await applyGamificationEvent(
    auth.user.userId,
    kind === "quiz"
      ? { type: "quiz_pass", module: moduleCode, chapterId: chapterId!, scorePct: score }
      : { type: "exam_complete", module: moduleCode, passed: score >= 65 },
  );

  return ok({ attempt, score, questionsTotal, correctAnswers, explanations, gamification: state, newBadges });
}
