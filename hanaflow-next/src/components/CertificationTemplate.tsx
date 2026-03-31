"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useAuth } from "@/context/AuthContext";
import { useGamification } from "@/context/GamificationContext";

// ── Icônes ────────────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface TCode { code: string; description: string; }
interface KeyConcept { term: string; definition?: string; description?: string; }
interface QuizQuestion { id?: string; question: string; options: string[]; correctIndex: number; explanation: string; }
interface Lesson { id: string; title: string; content: string[] | string; keyConcepts?: KeyConcept[]; tcodes?: TCode[]; }
interface Chapter { id: string; number?: number; title: string; weight?: number; isPremium: boolean; lessons: Lesson[]; quiz?: QuizQuestion[]; }
interface Certification { id: string; code?: string; name?: string; title?: string; shortName?: string; level?: string; examDuration?: number; examQuestions?: number; questions?: number; simulatorQuestions?: number; passingScore?: number; officialLink?: string; color: string; chapters: Chapter[]; }

// ── QuizBlock ─────────────────────────────────────────────────────────────────
function QuizBlock({ quiz, onComplete }: { quiz: QuizQuestion[]; onComplete?: (score: number, total: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const q = quiz[current];

  const handleSelect = (idx: number) => { if (!showResult) setSelected(idx); };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    setShowResult(true);
    setAnswers((prev) => [...prev, { questionId: q.id ?? String(current), correct }]);
  };

  const handleNext = () => {
    if (current < quiz.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      const finalScore = answers.filter((a) => a.correct).length + (selected === q.correctIndex ? 1 : 0);
      setScore(finalScore);
      setDone(true);
      if (onComplete) onComplete(finalScore, quiz.length);
    }
  };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    const passed = pct >= 65;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 text-center border-2 ${passed ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-orange-400 bg-orange-50 dark:bg-orange-900/20"}`}>
        <div className={`text-4xl font-black mb-2 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-orange-500"}`}>{score}/{quiz.length}</div>
        <p className={`text-lg font-bold ${passed ? "text-emerald-700 dark:text-emerald-300" : "text-orange-600 dark:text-orange-400"}`}>{passed ? "✓ Chapitre maîtrisé !" : "À retravailler"}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Score : {pct}% {passed ? "— Seuil de réussite atteint (65%)" : "— Seuil de réussite : 65%"}</p>
        <button onClick={() => { setCurrent(0); setSelected(null); setShowResult(false); setAnswers([]); setDone(false); setScore(0); }}
          className="mt-4 px-4 py-2 bg-sap-blue text-white rounded-xl text-sm font-semibold hover:bg-sap-blue-dark transition-colors">
          Recommencer le quiz
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Question {current + 1}/{quiz.length}</span>
        <div className="flex gap-1">
          {quiz.map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < current ? "bg-emerald-400" : i === current ? "bg-sap-blue" : "bg-gray-200 dark:bg-slate-700"}`} />
          ))}
        </div>
      </div>
      <p className="font-semibold text-slate-900 dark:text-white leading-relaxed">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
          if (!showResult) {
            cls += selected === idx ? "border-sap-blue bg-sap-blue/10 text-sap-blue dark:text-sap-accent font-medium" : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-sap-blue/50 hover:bg-gray-50 dark:hover:bg-slate-700";
          } else {
            if (idx === q.correctIndex) cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold";
            else if (idx === selected && idx !== q.correctIndex) cls += "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400";
            else cls += "border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-500";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={showResult}>
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ borderColor: showResult && idx === q.correctIndex ? "#34d399" : showResult && idx === selected && idx !== q.correctIndex ? "#f87171" : selected === idx ? "#0F52BA" : "#cbd5e1" }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Explication</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-3">
        {!showResult ? (
          <button onClick={handleConfirm} disabled={selected === null} className="px-5 py-2 bg-sap-blue text-white rounded-xl text-sm font-semibold hover:bg-sap-blue-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Valider</button>
        ) : (
          <button onClick={handleNext} className="px-5 py-2 bg-sap-blue text-white rounded-xl text-sm font-semibold hover:bg-sap-blue-dark transition-colors">
            {current < quiz.length - 1 ? "Question suivante →" : "Voir les résultats"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── LessonContent ─────────────────────────────────────────────────────────────
function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <div className="space-y-6">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {(Array.isArray(lesson.content) ? lesson.content : [lesson.content]).map((para, i) => (
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{para}</p>
        ))}
      </div>
      {lesson.keyConcepts && lesson.keyConcepts.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="h-1.5 w-6 bg-sap-blue rounded-full" />Concepts clés
          </h4>
          <div className="grid gap-2">
            {lesson.keyConcepts.map((c, i) => (
              <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-100 dark:border-blue-800">
                <span className="font-semibold text-sm text-blue-900 dark:text-blue-200">{c.term}</span>
                <span className="text-slate-600 dark:text-slate-400 text-sm"> — {c.definition ?? c.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {lesson.tcodes && lesson.tcodes.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="h-1.5 w-6 bg-emerald-500 rounded-full" />Transactions SAP (T-Codes)
          </h4>
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-700/50">
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200 w-28">Transaction</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200">Description</th>
                </tr>
              </thead>
              <tbody>
                {lesson.tcodes.map((t, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-slate-700">
                    <td className="px-4 py-2.5">
                      <code className="bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue dark:text-sap-accent px-2 py-0.5 rounded font-mono text-xs font-bold">{t.code}</code>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Template principal ────────────────────────────────────────────────────────
interface CertificationTemplateProps {
  certification: Certification;
  moduleId: string;
  examPath: string;
  heroGradient: string;
}

export default function CertificationTemplate({ certification, moduleId, examPath, heroGradient }: CertificationTemplateProps) {
  const { isPro, canAccess } = useSubscription();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { onLessonComplete, onQuizPass } = useGamification();

  const storageKey = `${moduleId}_completed_lessons`;

  const [activeChapter, setActiveChapter] = useState("ch1");
  const [activeLesson, setActiveLesson] = useState("l1-1");
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]")); }
    catch { return new Set(); }
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const cert = certification;
  const chapter = cert.chapters.find((c) => c.id === activeChapter);
  const lesson = chapter?.lessons.find((l) => l.id === activeLesson);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...completedLessons]));
  }, [completedLessons, storageKey]);

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set([...prev, lessonId]);
      onLessonComplete(moduleId, next.size);
      return next;
    });
  };

  const totalLessons = cert.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedCount = [...completedLessons].length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const handleChapterSelect = (ch: Chapter) => {
    if (!canAccess(ch.isPremium)) { setShowUpgradeModal(true); return; }
    setActiveChapter(ch.id);
    setActiveLesson(ch.lessons[0].id);
    setShowQuiz(false);
  };

  const handleUpgrade = () => router.push("/pricing");

  return (
    <>
      {/* Modal d'upgrade */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="text-center mb-5">
                <div className="h-14 w-14 bg-sap-blue/10 rounded-full flex items-center justify-center mx-auto mb-3"><LockIcon /></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contenu Pro</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Ce chapitre est réservé aux membres Pro. Passez au plan Pro pour accéder à l'intégralité des chapitres et au simulateur d'examen.</p>
              </div>
              <div className="space-y-2 mb-5">
                {["Accès à tous les chapitres (6 chapitres Pro)", "Simulateur d'examen complet (40 questions)", "Quiz détaillés avec explications", "Suivi de progression complet"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="h-5 w-5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0"><CheckIcon /></span>
                    {f}
                  </div>
                ))}
              </div>
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link href="/register" className="block w-full text-center py-2.5 bg-sap-blue text-white rounded-xl font-semibold text-sm hover:bg-sap-blue-dark transition-colors">Créer un compte gratuit</Link>
                  <p className="text-xs text-center text-slate-500">Déjà un compte ? <Link href="/login" className="text-sap-blue underline">Se connecter</Link></p>
                </div>
              ) : (
                <button onClick={handleUpgrade} className="w-full py-2.5 bg-sap-blue text-white rounded-xl font-semibold text-sm hover:bg-sap-blue-dark transition-colors">Activer le plan Pro (gratuit)</button>
              )}
              <p className="text-xs text-center text-slate-400 mt-3">Accès gratuit pendant la phase de lancement</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero */}
        <div className={`bg-linear-to-br ${heroGradient} text-white`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <nav className="flex items-center gap-2 text-xs text-white/60 mb-4">
              <Link href="/" className="hover:text-white">Accueil</Link>
              <span>/</span>
              <Link href="/certifications" className="hover:text-white">Certifications</Link>
              <span>/</span>
              <span className="text-white/90">{cert.shortName ?? cert.title}</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-white/60 mb-1">{cert.code ?? ""}</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{cert.shortName ?? cert.title}</h1>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">{cert.examQuestions ?? cert.questions} questions</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{cert.examDuration ?? "180"} min</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">Seuil : {cert.passingScore}%</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{cert.chapters.length} chapitres</span>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 min-w-[200px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">Progression</span>
                  <span className="text-sm font-bold">{progressPct}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-xs text-white/70 mt-1.5">{completedCount}/{totalLessons} leçons complétées</p>
              </div>
            </div>

            {!isPro && isAuthenticated && (
              <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-between gap-3">
                <p className="text-sm text-white/90"><span className="font-semibold">Plan gratuit :</span> Chapitre 1 débloqué. Passez au Pro pour tout accéder.</p>
                <button onClick={handleUpgrade} className="flex-shrink-0 px-4 py-1.5 bg-white text-sap-blue rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">Activer Pro (gratuit)</button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-between gap-3">
                <p className="text-sm text-white/90">Connectez-vous pour suivre votre progression et accéder au contenu Pro.</p>
                <Link href="/register" className="flex-shrink-0 px-4 py-1.5 bg-white text-sap-blue rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">S'inscrire gratuitement</Link>
              </div>
            )}
          </div>
        </div>

        {/* Corps principal */}
        <div className="bg-gray-50 dark:bg-sap-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex gap-6 items-start">
              {/* Sidebar */}
              <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chapitres</p>
                  </div>
                  <nav className="py-2">
                    {cert.chapters.map((ch) => {
                      const accessible = canAccess(ch.isPremium);
                      const isActive = ch.id === activeChapter;
                      const chapterLessonsCompleted = ch.lessons.filter((l) => completedLessons.has(l.id)).length;
                      return (
                        <button key={ch.id} onClick={() => handleChapterSelect(ch)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${isActive ? "bg-sap-blue/10 dark:bg-sap-blue/20" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${isActive ? "bg-sap-blue text-white" : accessible ? "bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-gray-100 dark:bg-slate-700 text-slate-400"}`}>
                            {accessible ? (ch.number ?? "·") : <LockIcon />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold leading-tight ${isActive ? "text-sap-blue dark:text-sap-accent" : accessible ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>{ch.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400 dark:text-slate-500">{chapterLessonsCompleted}/{ch.lessons.length} leçons</span>
                              {ch.isPremium && !accessible && (
                                <span className="text-xs bg-sap-blue/10 text-sap-blue dark:text-sap-accent px-1.5 py-0.5 rounded font-semibold">Pro</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700">
                    {canAccess(true) ? (
                      <Link href={examPath} className="block w-full text-center py-2.5 bg-sap-blue text-white rounded-xl text-sm font-semibold hover:bg-sap-blue-dark transition-colors">
                        🎯 Simuler l'examen (40 questions)
                      </Link>
                    ) : (
                      <button onClick={() => setShowUpgradeModal(true)} className="w-full text-center py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                        <LockIcon /> Simulateur d'examen (Pro)
                      </button>
                    )}
                  </div>
                </div>
              </aside>

              {/* Contenu principal */}
              <main className="flex-1 min-w-0">
                {chapter && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Chapitre {chapter.number ?? ""}{ chapter.weight ? ` · ${chapter.weight}% de l'examen` : ""}</p>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{chapter.title}</h2>
                      </div>
                    </div>
                    <div className="px-6 pt-4 flex flex-wrap gap-2 border-b border-gray-100 dark:border-slate-700 pb-3">
                      {chapter.lessons.map((l) => (
                        <button key={l.id} onClick={() => { setActiveLesson(l.id); setShowQuiz(false); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${activeLesson === l.id && !showQuiz ? "bg-sap-blue text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"}`}>
                          {completedLessons.has(l.id) && <span className="text-emerald-400"><CheckIcon /></span>}
                          {l.title.length > 35 ? l.title.substring(0, 35) + "…" : l.title}
                        </button>
                      ))}
                      <button onClick={() => setShowQuiz(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showQuiz ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"}`}>
                        Quiz du chapitre ({chapter.quiz?.length ?? 0} questions)
                      </button>
                    </div>
                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        {!showQuiz && lesson ? (
                          <motion.div key={lesson.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{lesson.title}</h3>
                            <LessonContent lesson={lesson} />
                            <div className="mt-6 flex justify-end">
                              <button onClick={() => markLessonComplete(lesson.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${completedLessons.has(lesson.id) ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-sap-blue text-white hover:bg-sap-blue-dark"}`}>
                                {completedLessons.has(lesson.id) ? <><CheckIcon /> Leçon complétée</> : "Marquer comme terminée"}
                              </button>
                            </div>
                          </motion.div>
                        ) : showQuiz ? (
                          <motion.div key="quiz" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Quiz — {chapter.title}</h3>
                            <QuizBlock quiz={chapter.quiz ?? []} onComplete={(s, t) => onQuizPass(Math.round((s / t) * 100))} />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Navigation mobile */}
                <div className="lg:hidden mt-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tous les chapitres</p>
                  </div>
                  {cert.chapters.map((ch) => {
                    const accessible = canAccess(ch.isPremium);
                    return (
                      <button key={ch.id} onClick={() => handleChapterSelect(ch)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0 flex items-center gap-3 transition-colors ${ch.id === activeChapter ? "bg-sap-blue/10" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}>
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ch.id === activeChapter ? "bg-sap-blue text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-500"}`}>
                          {accessible ? (ch.number ?? "·") : <LockIcon />}
                        </span>
                        <span className={`text-sm font-medium ${ch.id === activeChapter ? "text-sap-blue dark:text-sap-accent" : accessible ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>{ch.title}</span>
                        {ch.isPremium && !accessible && (
                          <span className="ml-auto text-xs bg-sap-blue/10 text-sap-blue px-2 py-0.5 rounded font-semibold">Pro</span>
                        )}
                      </button>
                    );
                  })}
                  <div className="px-4 py-3">
                    {canAccess(true) ? (
                      <Link href={examPath} className="block w-full text-center py-2.5 bg-sap-blue text-white rounded-xl text-sm font-semibold">🎯 Simuler l'examen</Link>
                    ) : (
                      <button onClick={() => setShowUpgradeModal(true)} className="w-full text-center py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                        <LockIcon /> Simulateur d'examen (Pro)
                      </button>
                    )}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
