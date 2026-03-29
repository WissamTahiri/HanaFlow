import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { mmMockExamQuestions, mmCertification } from "../data/certifications/mm.js";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import SEO from "../components/SEO.jsx";

const EXAM_DURATION = 90 * 60;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ── Écran de démarrage ───────────────────────────────────────────────────────
function StartScreen({ onStart }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center">
        <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Simulateur d'examen — {mmCertification.code}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{mmCertification.shortName}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Questions", value: mmMockExamQuestions.length },
            { label: "Durée", value: "90 min" },
            { label: "Seuil", value: "65%" },
            { label: "Format", value: "QCM" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p className="text-xl font-black text-emerald-600">{item.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">Avant de commencer :</p>
          <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
            <li>• {mmMockExamQuestions.length} questions à choix multiple, 4 options chacune</li>
            <li>• Chronomètre de 90 minutes (l'examen réel dure 180 min pour 80 questions)</li>
            <li>• Vous pouvez naviguer entre les questions et marquer pour révision</li>
            <li>• Score et explications détaillés à la fin</li>
          </ul>
        </div>

        <button onClick={onStart} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 transition-colors">
          Démarrer l'examen
        </button>
        <Link to="/certifications/mm" className="block mt-3 text-sm text-slate-500 hover:text-emerald-600 transition-colors">
          ← Retour aux chapitres
        </Link>
      </div>
    </motion.div>
  );
}

// ── Écran de résultats ───────────────────────────────────────────────────────
function ResultsScreen({ answers, questions, timeUsed }) {
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;
  const pct = Math.round((score / questions.length) * 100);
  const passed = pct >= 65;

  const byChapter = {};
  questions.forEach((q, i) => {
    if (!byChapter[q.chapter]) byChapter[q.chapter] = { total: 0, correct: 0 };
    byChapter[q.chapter].total++;
    if (answers[i] === q.correctIndex) byChapter[q.chapter].correct++;
  });

  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  if (reviewMode) {
    const q = questions[reviewIndex];
    const userAnswer = answers[reviewIndex];
    const isCorrect = userAnswer === q.correctIndex;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase">Révision · Question {reviewIndex + 1}/{questions.length}</p>
            <button onClick={() => setReviewMode(false)} className="text-sm text-emerald-600 hover:underline">Retour aux résultats</button>
          </div>
          <p className="text-xs text-slate-500 mb-2 font-medium">{q.chapter}</p>
          <p className="font-semibold text-slate-900 dark:text-white mb-4 leading-relaxed">{q.question}</p>
          <div className="space-y-2 mb-4">
            {q.options.map((opt, idx) => {
              let cls = "w-full text-left px-4 py-3 rounded-xl border text-sm ";
              if (idx === q.correctIndex) cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold";
              else if (idx === userAnswer && idx !== q.correctIndex) cls += "border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600";
              else cls += "border-gray-200 dark:border-slate-600 text-slate-500 dark:text-slate-500";
              return (
                <div key={idx} className={cls}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                  {idx === q.correctIndex && <span className="ml-2 text-emerald-500">✓ Bonne réponse</span>}
                  {idx === userAnswer && idx !== q.correctIndex && <span className="ml-2 text-red-500">✗ Votre réponse</span>}
                </div>
              );
            })}
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 mb-1">Explication</p>
            <p className="text-sm text-slate-700 dark:text-slate-200">{q.explanation}</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setReviewIndex((i) => Math.max(0, i - 1))} disabled={reviewIndex === 0} className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-sm font-semibold disabled:opacity-40">← Précédente</button>
            <button onClick={() => setReviewIndex((i) => Math.min(questions.length - 1, i + 1))} disabled={reviewIndex === questions.length - 1} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold disabled:opacity-40">Suivante →</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-5">
      <div className={`rounded-2xl p-8 text-center border-2 ${passed ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-orange-400 bg-orange-50 dark:bg-orange-900/20"}`}>
        <div className={`text-6xl font-black mb-2 ${passed ? "text-emerald-600 dark:text-emerald-400" : "text-orange-500"}`}>{pct}%</div>
        <p className={`text-xl font-bold mb-1 ${passed ? "text-emerald-700 dark:text-emerald-300" : "text-orange-600 dark:text-orange-400"}`}>
          {passed ? "✓ Examen réussi !" : "Examen non réussi"}
        </p>
        <p className="text-slate-600 dark:text-slate-400">
          {score}/{questions.length} bonnes réponses · Temps utilisé : {formatTime(timeUsed)}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          Seuil de réussite : 65% {passed ? `· Vous avez dépassé le seuil de ${pct - 65} points` : `· Il vous manque ${65 - pct} points`}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Résultats par chapitre</h3>
        <div className="space-y-3">
          {Object.entries(byChapter).map(([chapter, data]) => {
            const chPct = Math.round((data.correct / data.total) * 100);
            return (
              <div key={chapter}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate max-w-[80%]">{chapter}</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{data.correct}/{data.total}</p>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${chPct >= 65 ? "bg-emerald-500" : chPct >= 40 ? "bg-orange-400" : "bg-red-500"}`}
                    style={{ width: `${chPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => setReviewMode(true)}
          className="flex-1 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          Revoir les questions
        </button>
        <Link to="/certifications/mm"
          className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold text-center hover:bg-emerald-700 transition-colors">
          Retour aux chapitres
        </Link>
      </div>

      {!passed && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-sm text-emerald-800 dark:text-emerald-200">
          <p className="font-semibold mb-1">Chapitres à renforcer :</p>
          <ul className="space-y-1">
            {Object.entries(byChapter)
              .filter(([, data]) => data.correct / data.total < 0.65)
              .map(([chapter]) => <li key={chapter}>• Révisez : <strong>{chapter}</strong></li>)
            }
          </ul>
        </div>
      )}
    </motion.div>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────
export default function ExamSimulatorMM() {
  const { canAccess } = useSubscription();
  const navigate = useNavigate();

  const [phase, setPhase] = useState("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(new Array(mmMockExamQuestions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [timeUsed, setTimeUsed] = useState(0);
  const [flagged, setFlagged] = useState(new Set());
  const timerRef = useRef(null);

  if (!canAccess(true)) {
    return (
      <>
        <SEO title="Simulateur d'examen SAP MM" description="Accès Pro requis" path="/certifications/mm/examen" />
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sapDark flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 text-center max-w-md">
            <div className="h-14 w-14 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Simulateur d'examen — Accès Pro</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Le simulateur d'examen est réservé aux membres Pro. Activez le plan Pro gratuitement.
            </p>
            <Link to="/certifications/mm" className="block w-full py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors">
              Retour — Activer Pro
            </Link>
          </div>
        </div>
      </>
    );
  }

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase("results"); return 0; }
        return t - 1;
      });
      setTimeUsed((u) => u + 1);
    }, 1000);
  }, []);

  useEffect(() => { return () => clearInterval(timerRef.current); }, []);

  const handleStart = () => { setPhase("exam"); startTimer(); };
  const handleAnswer = (idx) => {
    setAnswers((prev) => { const next = [...prev]; next[currentQ] = idx; return next; });
  };
  const handleSubmit = () => { clearInterval(timerRef.current); setPhase("results"); };
  const toggleFlag = () => {
    setFlagged((prev) => { const next = new Set(prev); next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ); return next; });
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const q = mmMockExamQuestions[currentQ];
  const timerColor = timeLeft < 300 ? "text-red-500" : timeLeft < 900 ? "text-orange-500" : "text-slate-700 dark:text-slate-200";

  return (
    <>
      <SEO title="Simulateur d'examen SAP MM — C_TS4MM_2023" description="Simulateur d'examen 40 questions format réel SAP MM Materials Management." path="/certifications/mm/examen" />
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sapDark">

        {phase === "exam" && (
          <div className="sticky top-16 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-2">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Q {currentQ + 1}/{mmMockExamQuestions.length}
                </span>
                <span className="text-xs text-slate-400">{answeredCount}/{mmMockExamQuestions.length} répondues</span>
              </div>
              <div className={`flex items-center gap-1.5 font-mono font-bold text-lg ${timerColor}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {formatTime(timeLeft)}
              </div>
              <button onClick={handleSubmit} className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
                Terminer l'examen
              </button>
            </div>
            <div className="max-w-4xl mx-auto mt-2">
              <div className="h-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${(answeredCount / mmMockExamQuestions.length) * 100}%` }} />
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-8">
          {phase === "start" && <StartScreen onStart={handleStart} />}

          {phase === "exam" && (
            <div className="grid lg:grid-cols-[1fr_auto] gap-5">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-600/10 dark:bg-emerald-600/20 px-2.5 py-1 rounded-lg">
                    {q.chapter}
                  </span>
                  <button onClick={toggleFlag}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors font-semibold ${
                      flagged.has(currentQ)
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 border-amber-300 dark:border-amber-700"
                        : "bg-gray-100 dark:bg-slate-700 text-slate-500 border-gray-200 dark:border-slate-600"
                    }`}>
                    {flagged.has(currentQ) ? "★ Marquée" : "☆ Marquer"}
                  </button>
                </div>

                <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed mb-5">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <button key={idx} onClick={() => handleAnswer(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        answers[currentQ] === idx
                          ? "border-emerald-600 bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 font-semibold"
                          : "border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-400/40 hover:bg-gray-50 dark:hover:bg-slate-700"
                      }`}>
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          answers[currentQ] === idx ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 dark:border-slate-600"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <button onClick={() => setCurrentQ((c) => Math.max(0, c - 1))} disabled={currentQ === 0}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors">
                    ← Précédente
                  </button>
                  <span className="text-xs text-slate-400">{answers[currentQ] !== null ? "✓ Répondue" : "Non répondue"}</span>
                  <button onClick={() => setCurrentQ((c) => Math.min(mmMockExamQuestions.length - 1, c + 1))} disabled={currentQ === mmMockExamQuestions.length - 1}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors">
                    Suivante →
                  </button>
                </div>
              </motion.div>

              <div className="lg:w-48">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-4 sticky top-32">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Navigation</p>
                  <div className="grid grid-cols-5 gap-1">
                    {mmMockExamQuestions.map((_, i) => (
                      <button key={i} onClick={() => setCurrentQ(i)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors ${
                          i === currentQ ? "bg-emerald-600 text-white"
                          : flagged.has(i) ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 border border-amber-300 dark:border-amber-700"
                          : answers[i] !== null ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[
                      { color: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200", label: "Répondue" },
                      { color: "bg-amber-100 dark:bg-amber-900/30 border border-amber-300", label: "Marquée" },
                      { color: "bg-gray-100 dark:bg-slate-700", label: "Non répondue" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2 text-xs text-slate-500">
                        <div className={`h-3 w-3 rounded ${color}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {phase === "results" && <ResultsScreen answers={answers} questions={mmMockExamQuestions} timeUsed={timeUsed} />}
        </div>
      </div>
    </>
  );
}
