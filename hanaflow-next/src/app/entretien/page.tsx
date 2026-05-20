"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProGate from "@/components/ProGate";

/**
 * Page /entretien — Mock interview SAP par IA.
 *
 * Flow :
 *  1. setup : module + séniorité + style → POST /api/interview/start
 *  2. interview : Q par Q, textarea, navigation linéaire
 *  3. report : POST /api/interview/grade → score, feedback, idealAnswer par Q
 *
 * Aucun state serveur : tout est dans le state React. Si user reload pendant
 * l'entretien, il perd sa session (acceptable pour V1).
 */

type ModuleCode = "FI" | "CO" | "MM" | "SD" | "PP" | "AI";
type Seniority = "junior" | "confirmed" | "senior";
type Style = "technical" | "case-study" | "mixed";

type Question = {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  focus: string;
  idealAnswer: string;
};

type GradeItem = {
  id: number;
  score: number;
  verdict: "correct" | "partial" | "incorrect" | "blank";
  feedback: string;
};

type Report = {
  perQuestion: GradeItem[];
  overall: {
    score: number;
    grade: "A" | "B" | "C" | "D" | "F";
    verdict: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    hireability: "hire" | "borderline" | "no-hire";
  };
  idealAnswers: { id: number; idealAnswer: string }[];
};

const MODULES: { value: ModuleCode; label: string; sub: string; color: string }[] = [
  { value: "FI", label: "Financial Accounting", sub: "Compta générale, AP, AR, AA", color: "from-blue-500 to-blue-700" },
  { value: "CO", label: "Controlling", sub: "Contrôle de gestion, CO-PA", color: "from-indigo-500 to-indigo-700" },
  { value: "MM", label: "Sourcing & Procurement", sub: "Achats, stocks, P2P", color: "from-sky-500 to-sky-700" },
  { value: "SD", label: "Sales & Distribution", sub: "OTC, pricing, livraison", color: "from-cyan-500 to-cyan-700" },
  { value: "PP", label: "Production Planning", sub: "MRP, ordres, BOM", color: "from-emerald-500 to-emerald-700" },
  { value: "AI", label: "Generative AI Developer", sub: "Joule, RAG, AI Core", color: "from-violet-500 to-purple-700" },
];

const SENIORITIES: { value: Seniority; label: string; sub: string }[] = [
  { value: "junior", label: "Junior", sub: "0 à 2 ans d'expérience SAP" },
  { value: "confirmed", label: "Confirmé", sub: "3 à 5 ans d'expérience" },
  { value: "senior", label: "Senior / Lead", sub: "6+ ans, choix d'architecture" },
];

const STYLES: { value: Style; label: string; sub: string }[] = [
  { value: "technical", label: "Technique", sub: "T-codes, tables, paramétrage" },
  { value: "case-study", label: "Mise en situation", sub: "« Tu interviens chez un client X… »" },
  { value: "mixed", label: "Mixte", sub: "Moitié technique, moitié cas client" },
];

const DIFFICULTY_STYLE: Record<Question["difficulty"], { label: string; cls: string }> = {
  easy: { label: "Facile", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  medium: { label: "Intermédiaire", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  hard: { label: "Difficile", cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
};

const VERDICT_STYLE: Record<GradeItem["verdict"], { label: string; cls: string }> = {
  correct: { label: "Correct", cls: "bg-emerald-500" },
  partial: { label: "Partiel", cls: "bg-amber-500" },
  incorrect: { label: "Faux", cls: "bg-rose-500" },
  blank: { label: "Vide", cls: "bg-slate-400" },
};

const HIRE_STYLE: Record<Report["overall"]["hireability"], { label: string; cls: string }> = {
  hire: { label: "À embaucher", cls: "bg-emerald-500 text-white" },
  borderline: { label: "À reconfirmer", cls: "bg-amber-500 text-white" },
  "no-hire": { label: "Pas au niveau", cls: "bg-rose-500 text-white" },
};

function EntretienContent() {
  const { getToken } = useAuth();

  const [phase, setPhase] = useState<"setup" | "interview" | "grading" | "report">("setup");
  const [moduleCode, setModuleCode] = useState<ModuleCode | null>(null);
  const [seniority, setSeniority] = useState<Seniority | null>(null);
  const [style, setStyle] = useState<Style | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startInterview = async () => {
    if (!moduleCode || !seniority || !style) return;
    setError("");
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Session expirée — reconnecte-toi.");
        return;
      }
      const r = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ moduleCode, seniority, style }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur de génération");
        return;
      }
      setQuestions(d.questions);
      setAnswers({});
      setCurrentQ(0);
      setPhase("interview");
    } catch {
      setError("Erreur réseau, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  const submitForGrading = async () => {
    if (!moduleCode || !seniority) return;
    setError("");
    setPhase("grading");
    try {
      const token = await getToken();
      if (!token) {
        setError("Session expirée — reconnecte-toi.");
        setPhase("interview");
        return;
      }
      const r = await fetch("/api/interview/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({
          moduleCode,
          seniority,
          items: questions.map((q) => ({
            id: q.id,
            question: q.text,
            difficulty: q.difficulty,
            focus: q.focus,
            idealAnswer: q.idealAnswer,
            answer: answers[q.id] ?? "",
          })),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur de notation");
        setPhase("interview");
        return;
      }
      setReport({ perQuestion: d.perQuestion, overall: d.overall, idealAnswers: d.idealAnswers });
      setPhase("report");
    } catch {
      setError("Erreur réseau, réessaie.");
      setPhase("interview");
    }
  };

  const reset = () => {
    setPhase("setup");
    setModuleCode(null);
    setSeniority(null);
    setStyle(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQ(0);
    setReport(null);
    setError("");
  };

  const total = questions.length;
  const current = questions[currentQ];
  const progressPct = total > 0 ? Math.round(((currentQ + 1) / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            Mock interview IA
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 text-balance">
            Entraîne-toi à passer un entretien consultant SAP
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Un recruteur IA te pose 6 questions adaptées à ton module et ta séniorité.
            Tu réponds, tu reçois un scoring détaillé question par question + un verdict global.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ────────────── SETUP ────────────── */}
          {phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Module */}
              <section className="card p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Module SAP</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Sur quel module veux-tu être testé ?</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MODULES.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setModuleCode(m.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        moduleCode === m.value
                          ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
                          : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`h-8 w-8 rounded-lg bg-linear-to-br ${m.color} flex items-center justify-center text-white text-xs font-extrabold`}>
                          {m.value}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">{m.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.sub}</p>
                    </button>
                  ))}
                </div>
              </section>

              {/* Séniorité */}
              <section className="card p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Séniorité visée</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Le niveau du poste pour lequel tu passes l&apos;entretien.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {SENIORITIES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSeniority(s.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        seniority === s.value
                          ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
                          : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">{s.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.sub}</p>
                    </button>
                  ))}
                </div>
              </section>

              {/* Style */}
              <section className="card p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Style d&apos;entretien</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Quel format tu veux travailler aujourd&apos;hui ?</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        style === s.value
                          ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
                          : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-white mb-1">{s.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{s.sub}</p>
                    </button>
                  ))}
                </div>
              </section>

              {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}

              <div className="flex justify-center pt-2">
                <button
                  onClick={startInterview}
                  disabled={!moduleCode || !seniority || !style || loading}
                  className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Génération en cours..." : "Lancer l'entretien →"}
                </button>
              </div>
              <p className="text-xs text-slate-400 text-center -mt-4">
                Limite : 3 entretiens / heure (free tier IA)
              </p>
            </motion.div>
          )}

          {/* ────────────── INTERVIEW ────────────── */}
          {phase === "interview" && current && (
            <motion.div
              key={`interview-${currentQ}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="card p-6 sm:p-8"
            >
              {/* Progress */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Question {currentQ + 1} / {total}
                  </span>
                  <span className="text-slate-400">{progressPct} %</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sap-blue transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_STYLE[current.difficulty].cls}`}>
                  {DIFFICULTY_STYLE[current.difficulty].label}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {current.focus}
                </span>
              </div>

              {/* Question */}
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-4 leading-relaxed text-balance">
                {current.text}
              </p>

              {/* Answer */}
              <textarea
                value={answers[current.id] ?? ""}
                onChange={(e) => setAnswers((p) => ({ ...p, [current.id]: e.target.value }))}
                placeholder="Ta réponse... (cite des T-codes, des tables, donne un exemple concret)"
                rows={8}
                maxLength={4000}
                className="w-full p-4 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sap-blue/40 leading-relaxed resize-none"
              />
              <p className="text-[10px] text-slate-400 text-right mt-1">
                {(answers[current.id] ?? "").length} / 4000
              </p>

              {error && <p className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}

              {/* Nav */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-gray-100 dark:border-slate-700">
                <button
                  onClick={() => setCurrentQ((i) => Math.max(0, i - 1))}
                  disabled={currentQ === 0}
                  className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Précédente
                </button>

                {currentQ < total - 1 ? (
                  <button
                    onClick={() => setCurrentQ((i) => i + 1)}
                    className="btn-primary px-5 py-2 text-sm"
                  >
                    Suivante →
                  </button>
                ) : (
                  <button
                    onClick={submitForGrading}
                    className="btn-primary px-5 py-2 text-sm"
                  >
                    Terminer et obtenir mon scoring →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ────────────── GRADING ────────────── */}
          {phase === "grading" && (
            <motion.div
              key="grading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card p-12 text-center"
            >
              <div className="inline-block h-12 w-12 rounded-full border-4 border-sap-blue border-t-transparent animate-spin mb-4" />
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Notation en cours...
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Le recruteur IA évalue tes 6 réponses. ~10-15 secondes.
              </p>
            </motion.div>
          )}

          {/* ────────────── REPORT ────────────── */}
          {phase === "report" && report && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Hero verdict */}
              <div className="card p-8 sm:p-10 bg-linear-to-br from-sap-blue-dark to-sap-blue text-white border-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="shrink-0 h-28 w-28 rounded-2xl bg-white/15 backdrop-blur-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold">{report.overall.score}</span>
                    <span className="text-xs uppercase tracking-wider text-white/70">/ 100</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-md text-xs font-bold bg-white/20 backdrop-blur-sm">
                        Note : {report.overall.grade}
                      </span>
                      <span className={`px-3 py-1 rounded-md text-xs font-bold ${HIRE_STYLE[report.overall.hireability].cls}`}>
                        {HIRE_STYLE[report.overall.hireability].label}
                      </span>
                    </div>
                    <p className="text-lg font-semibold leading-snug">{report.overall.verdict}</p>
                  </div>
                </div>
              </div>

              {/* Strengths + weaknesses */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400 mb-4">
                    Points forts
                  </h3>
                  <ul className="space-y-2.5">
                    {report.overall.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400 mb-4">
                    Axes d&apos;amélioration
                  </h3>
                  {report.overall.weaknesses.length > 0 ? (
                    <ul className="space-y-2.5">
                      {report.overall.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                          <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold">↑</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">Aucun point faible relevé.</p>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div className="card p-6 bg-sap-blue/5 dark:bg-sap-blue/10 border border-sap-blue/20">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-sap-blue dark:text-sap-accent mb-2">
                  Reco prioritaire
                </h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {report.overall.recommendation}
                </p>
              </div>

              {/* Per-question breakdown */}
              <div className="card p-6 sm:p-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Détail par question
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  Compare ta réponse avec la réponse modèle pour réviser.
                </p>
                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const gr = report.perQuestion.find((g) => g.id === q.id);
                    const ideal = report.idealAnswers.find((a) => a.id === q.id)?.idealAnswer;
                    const yourAnswer = answers[q.id]?.trim() || "[Tu n'as pas répondu]";
                    if (!gr) return null;
                    return (
                      <details key={q.id} className="group rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                        <summary className="cursor-pointer p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors list-none">
                          <span className={`shrink-0 h-2 w-2 rounded-full ${VERDICT_STYLE[gr.verdict].cls}`} />
                          <span className="shrink-0 text-xs font-bold text-slate-400">Q{idx + 1}</span>
                          <span className="flex-1 min-w-0 text-sm text-slate-700 dark:text-slate-300 truncate">{q.text}</span>
                          <span className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">{gr.score}/10</span>
                        </summary>
                        <div className="px-4 pb-4 pt-1 space-y-3 text-sm">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ta réponse</p>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{yourAnswer}</p>
                          </div>
                          <div className="rounded-lg bg-sap-blue/5 dark:bg-sap-blue/10 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-sap-blue dark:text-sap-accent mb-1">Feedback recruteur</p>
                            <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{gr.feedback}</p>
                          </div>
                          {ideal && (
                            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">Réponse modèle</p>
                              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{ideal}</p>
                            </div>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button onClick={reset} className="btn-primary px-6 py-3">
                  Refaire un entretien
                </button>
                <Link href={`/modules-sap/${moduleCode?.toLowerCase()}`} className="btn-outline px-6 py-3">
                  Réviser le module {moduleCode}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EntretienPage() {
  return (
    <ProtectedRoute>
      <ProGate
        featureName="Mock Interview SAP IA"
        featureDescription="Un recruteur IA te pose 6 questions adaptées à ton module et ta séniorité, puis te score sur 100 avec feedback détaillé par question."
        perks={[
          "Questions générées par IA selon module + séniorité (junior / confirmé / senior)",
          "3 styles d'entretien : technique pur, cas client, ou mixte",
          "Score global /100 + grade A-F + verdict hire/borderline/no-hire",
          "Feedback question par question avec réponse modèle pour réviser",
          "3 entretiens par heure (free tier IA)",
        ]}
      >
        <EntretienContent />
      </ProGate>
    </ProtectedRoute>
  );
}
