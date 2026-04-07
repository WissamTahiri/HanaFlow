import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { coCertification } from "../data/certifications/co.js";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useGamification } from "../context/GamificationContext.jsx";
import SEO from "../components/SEO.jsx";

// ── Icônes ──────────────────────────────────────────────────────────────────
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

// ── QuizBlock ────────────────────────────────────────────────────────────────
function QuizBlock({ quiz }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const q = quiz[current];

  const handleSelect = (idx) => { if (!showResult) setSelected(idx); };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = selected === q.correctIndex;
    setShowResult(true);
    setAnswers((prev) => [...prev, { questionId: q.id, correct }]);
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
    }
  };

  if (done) {
    const pct = Math.round((score / quiz.length) * 100);
    const passed = pct >= 65;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-6 text-center border-2 ${passed ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-orange-400 bg-orange-50 dark:bg-orange-900/20"}`}
      >
        <div className={`text-4xl font-black mb-2 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-orange-500"}`}>
          {score}/{quiz.length}
        </div>
        <p className={`text-lg font-bold ${passed ? "text-emerald-700 dark:text-emerald-300" : "text-orange-600 dark:text-orange-400"}`}>
          {passed ? "✓ Chapitre maîtrisé !" : "À retravailler"}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Score : {pct}% {passed ? "— Seuil de réussite atteint (65%)" : "— Seuil : 65%"}
        </p>
        <button
          onClick={() => { setCurrent(0); setSelected(null); setShowResult(false); setAnswers([]); setDone(false); setScore(0); }}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
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
            <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i < current ? "bg-emerald-400" : i === current ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-700"}`} />
          ))}
        </div>
      </div>

      <p className="font-semibold text-slate-900 dark:text-white leading-relaxed">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
          if (!showResult) {
            cls += selected === idx
              ? "border-indigo-600 bg-indigo-600/10 text-indigo-700 dark:text-indigo-400 font-medium"
              : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-400/50 hover:bg-gray-50 dark:hover:bg-slate-700";
          } else {
            if (idx === q.correctIndex) cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold";
            else if (idx === selected && idx !== q.correctIndex) cls += "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400";
            else cls += "border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-500";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={showResult}>
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ borderColor: showResult && idx === q.correctIndex ? "#34d399" : showResult && idx === selected && idx !== q.correctIndex ? "#f87171" : selected === idx ? "#4f46e5" : "#cbd5e1" }}>
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600"
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Explication</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">{q.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3">
        {!showResult ? (
          <button onClick={handleConfirm} disabled={selected === null}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Valider
          </button>
        ) : (
          <button onClick={handleNext}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            {current < quiz.length - 1 ? "Question suivante →" : "Voir les résultats"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── LessonContent ────────────────────────────────────────────────────────────
function LessonContent({ lesson }) {
  return (
    <div className="space-y-6">
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {lesson.content.map((para, i) => (
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{para}</p>
        ))}
      </div>

      {lesson.keyConcepts?.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="h-1.5 w-6 bg-indigo-600 rounded-full" />
            Concepts clés
          </h4>
          <div className="grid gap-2">
            {lesson.keyConcepts.map((c, i) => (
              <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl px-4 py-3 border border-indigo-100 dark:border-indigo-800">
                <span className="font-semibold text-sm text-indigo-900 dark:text-indigo-200">{c.term}</span>
                <span className="text-slate-600 dark:text-slate-400 text-sm"> — {c.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lesson.tcodes?.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="h-1.5 w-6 bg-emerald-500 rounded-full" />
            Transactions SAP (T-Codes)
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
                      <code className="bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded font-mono text-xs font-bold">
                        {t.code}
                      </code>
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

// ── Composant principal ──────────────────────────────────────────────────────
export default function CertificationCO() {
  const { isPro, canAccess } = useSubscription();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { onLessonComplete, onQuizPass } = useGamification();

  const [activeChapter, setActiveChapter] = useState("ch1");
  const [activeLesson, setActiveLesson] = useState("l1-1");
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("co_completed_lessons") || "[]"));
    } catch { return new Set(); }
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const cert = coCertification;
  const chapter = cert.chapters.find((c) => c.id === activeChapter);
  const lesson = chapter?.lessons.find((l) => l.id === activeLesson);

  useEffect(() => {
    localStorage.setItem("co_completed_lessons", JSON.stringify([...completedLessons]));
  }, [completedLessons]);

  const markLessonComplete = (lessonId) => {
    setCompletedLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set([...prev, lessonId]);
      onLessonComplete("co", next.size);
      return next;
    });
  };

  const totalLessons = cert.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedCount = [...completedLessons].length;
  const progressPct = Math.round((completedCount / totalLessons) * 100);

  const handleChapterSelect = (ch) => {
    if (!canAccess(ch.isPremium)) {
      setShowUpgradeModal(true);
      return;
    }
    setActiveChapter(ch.id);
    setActiveLesson(ch.lessons[0].id);
    setShowQuiz(false);
  };

  const handleUpgrade = () => navigate("/pricing");

  return (
    <>
      <SEO
        title="Certification SAP CO — C_TS4CO_2023"
        description="Préparez la certification SAP Management Accounting (C_TS4CO_2023) avec 7 chapitres, des quiz et un simulateur d'examen de 40 questions."
        path="/certifications/co"
      />

      {/* Modal d'upgrade */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                  <LockIcon />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contenu Pro</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Ce chapitre est réservé aux membres Pro. Passez au plan Pro pour accéder à tous les chapitres CO et au simulateur d'examen.
                </p>
              </div>
              <div className="space-y-2 mb-5">
                {[
                  "7 chapitres CO complets (C_TS4CO_2023)",
                  "Simulateur d'examen 40 questions",
                  "Quiz détaillés avec explications",
                  "Suivi de progression complet",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <span className="h-5 w-5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                      <CheckIcon />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              {!isAuthenticated ? (
                <div className="space-y-2">
                  <Link to="/register" className="block w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    Créer un compte gratuit
                  </Link>
                  <p className="text-xs text-center text-slate-500">
                    Déjà un compte ? <Link to="/login" className="text-indigo-600 underline">Se connecter</Link>
                  </p>
                </div>
              ) : (
                <button onClick={handleUpgrade} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  Activer le plan Pro (gratuit)
                </button>
              )}
              <p className="text-xs text-center text-slate-400 mt-3">Accès gratuit pendant la phase de lancement</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero */}
        <div className="grain relative bg-slate-950 text-white overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <Link to="/" className="hover:text-slate-300">Accueil</Link>
              <span>/</span>
              <Link to="/certifications" className="hover:text-slate-300">Certifications</Link>
              <span>/</span>
              <span className="text-white/90">SAP CO</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-white/60 mb-1">{cert.code}</p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-display mb-2">{cert.shortName}</h1>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full">{cert.examQuestions} questions</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{cert.examDuration} min</span>
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
                <p className="text-sm text-white/90">
                  <span className="font-semibold">Plan gratuit :</span> Chapitre 1 débloqué. Passez au Pro pour tout accéder.
                </p>
                <button onClick={handleUpgrade} className="flex-shrink-0 px-4 py-1.5 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">
                  Activer Pro (gratuit)
                </button>
              </div>
            )}
            {!isAuthenticated && (
              <div className="mt-4 bg-white/10 border border-white/20 rounded-xl p-3 flex items-center justify-between gap-3">
                <p className="text-sm text-white/90">Connectez-vous pour suivre votre progression.</p>
                <Link to="/register" className="flex-shrink-0 px-4 py-1.5 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-white/90 transition-colors">
                  S'inscrire gratuitement
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Corps principal */}
        <div className="bg-gray-50 dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex gap-6 items-start">

              {/* Sidebar */}
              <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-20">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Chapitres</p>
                  </div>
                  <nav className="py-2">
                    {cert.chapters.map((ch) => {
                      const accessible = canAccess(ch.isPremium);
                      const isActive = ch.id === activeChapter;
                      const chLessonsCompleted = ch.lessons.filter((l) => completedLessons.has(l.id)).length;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => handleChapterSelect(ch)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors
                            ${isActive ? "bg-indigo-600/10 dark:bg-indigo-600/20" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}
                        >
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold
                            ${isActive ? "bg-indigo-600 text-white" : accessible ? "bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-gray-100 dark:bg-slate-700 text-slate-400"}`}>
                            {accessible ? ch.number : <LockIcon />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold leading-tight ${isActive ? "text-indigo-600 dark:text-indigo-400" : accessible ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                              {ch.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {chLessonsCompleted}/{ch.lessons.length} leçons
                              </span>
                              {ch.isPremium && !accessible && (
                                <span className="text-xs bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-semibold">Pro</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                  <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700">
                    {canAccess(true) ? (
                      <Link to="/certifications/co/examen"
                        className="block w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                        🎯 Simuler l'examen (40 questions)
                      </Link>
                    ) : (
                      <button onClick={() => setShowUpgradeModal(true)}
                        className="w-full text-center py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                        <LockIcon /> Simulateur d'examen (Pro)
                      </button>
                    )}
                  </div>
                </div>
              </aside>

              {/* Contenu principal */}
              <main className="flex-1 min-w-0">
                {chapter && (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                        Chapitre {chapter.number} · {chapter.weight}% de l'examen
                      </p>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{chapter.title}</h2>
                    </div>

                    <div className="px-6 pt-4 flex flex-wrap gap-2 border-b border-gray-100 dark:border-slate-700 pb-3">
                      {chapter.lessons.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => { setActiveLesson(l.id); setShowQuiz(false); }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5
                            ${activeLesson === l.id && !showQuiz
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"}`}
                        >
                          {completedLessons.has(l.id) && <span className="text-emerald-400"><CheckIcon /></span>}
                          {l.title.length > 35 ? l.title.substring(0, 35) + "…" : l.title}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowQuiz(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                          ${showQuiz
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"}`}
                      >
                        Quiz du chapitre ({chapter.quiz.length} questions)
                      </button>
                    </div>

                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        {!showQuiz && lesson ? (
                          <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">{lesson.title}</h3>
                            <LessonContent lesson={lesson} />
                            <div className="mt-6 flex justify-end">
                              <button
                                onClick={() => markLessonComplete(lesson.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2
                                  ${completedLessons.has(lesson.id)
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                              >
                                {completedLessons.has(lesson.id) ? <><CheckIcon /> Leçon complétée</> : "Marquer comme terminée"}
                              </button>
                            </div>
                          </motion.div>
                        ) : showQuiz ? (
                          <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                              Quiz — {chapter.title}
                            </h3>
                            <QuizBlock quiz={chapter.quiz} chapterId={chapter.id} onComplete={(s, t) => onQuizPass(Math.round((s / t) * 100))} />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Navigation mobile */}
                <div className="lg:hidden mt-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tous les chapitres</p>
                  </div>
                  {cert.chapters.map((ch) => {
                    const accessible = canAccess(ch.isPremium);
                    return (
                      <button
                        key={ch.id}
                        onClick={() => handleChapterSelect(ch)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 dark:border-slate-700/50 last:border-0 flex items-center gap-3 transition-colors
                          ${ch.id === activeChapter ? "bg-indigo-600/10" : "hover:bg-gray-50 dark:hover:bg-slate-700/50"}`}
                      >
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                          ${ch.id === activeChapter ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-500"}`}>
                          {accessible ? ch.number : <LockIcon />}
                        </span>
                        <span className={`text-sm font-medium ${ch.id === activeChapter ? "text-indigo-600 dark:text-indigo-400" : accessible ? "text-slate-800 dark:text-slate-200" : "text-slate-400"}`}>
                          {ch.title}
                        </span>
                        {ch.isPremium && !accessible && (
                          <span className="ml-auto text-xs bg-indigo-600/10 text-indigo-600 px-2 py-0.5 rounded font-semibold">Pro</span>
                        )}
                      </button>
                    );
                  })}
                  <div className="px-4 py-3">
                    {canAccess(true) ? (
                      <Link to="/certifications/co/examen" className="block w-full text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                        🎯 Simuler l'examen
                      </Link>
                    ) : (
                      <button onClick={() => setShowUpgradeModal(true)} className="w-full text-center py-2.5 bg-gray-100 dark:bg-slate-700 text-slate-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                        <LockIcon /> Simulateur (Pro)
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
