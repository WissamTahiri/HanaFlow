"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

type Level = "beginner" | "some-knowledge" | "experienced";
type Goal =
  | "junior-consultant"
  | "freelance"
  | "lead-architect"
  | "career-change"
  | "upskill";
type ModuleCode = "FI" | "CO" | "MM" | "SD" | "PP" | "AI";

type Roadmap = {
  summary: string;
  estimatedTotalWeeks: number;
  modules: { code: ModuleCode; order: number; weeks: number; why: string }[];
  milestones: { week: number; title: string; description: string }[];
  nextSteps: string[];
};

const LEVELS: { value: Level; title: string; desc: string }[] = [
  { value: "beginner", title: "Débutant total", desc: "Je n'ai jamais touché à SAP" },
  { value: "some-knowledge", title: "Quelques notions", desc: "Vu en école, lu des articles, mais rien de structuré" },
  { value: "experienced", title: "Déjà de l'expérience", desc: "Autre module SAP, version antérieure, ou environnement client" },
];

const GOALS: { value: Goal; title: string; desc: string }[] = [
  { value: "junior-consultant", title: "Consultant SAP junior", desc: "Décrocher un premier poste en cabinet ou ESN" },
  { value: "career-change", title: "Reconversion totale", desc: "Je viens d'un autre métier, je vise SAP" },
  { value: "upskill", title: "Monter en compétence", desc: "Je suis déjà en poste, je veux upgrade" },
  { value: "freelance", title: "Freelance / indépendant", desc: "Me mettre à mon compte sur le moyen terme" },
  { value: "lead-architect", title: "Lead / architecte", desc: "Viser un poste senior à terme" },
];

const HOURS_OPTIONS = [
  { value: 5, label: "5 h", desc: "Soirée et weekend" },
  { value: 10, label: "10 h", desc: "Engagé mais réaliste" },
  { value: 20, label: "20 h", desc: "Mi-temps formation" },
  { value: 40, label: "40 h", desc: "Plein temps reconversion" },
];

const MODULES: { value: ModuleCode; label: string }[] = [
  { value: "FI", label: "Finance" },
  { value: "CO", label: "Controlling" },
  { value: "MM", label: "Sourcing & Procurement" },
  { value: "SD", label: "Sales & Distribution" },
  { value: "PP", label: "Production Planning" },
  { value: "AI", label: "IA Générative" },
];

function RoadmapPersoContent() {
  const { token } = useAuth();

  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [hoursPerWeek, setHoursPerWeek] = useState<number | null>(null);
  const [targetIndustry, setTargetIndustry] = useState("");
  const [preferredModule, setPreferredModule] = useState<ModuleCode | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  const totalSteps = 5;
  const progressPercent = Math.round(((step + (roadmap ? 1 : 0)) / (totalSteps + 1)) * 100);

  const canContinue =
    (step === 0 && level !== null) ||
    (step === 1 && goal !== null) ||
    (step === 2 && hoursPerWeek !== null) ||
    step === 3 ||
    step === 4;

  const submit = async () => {
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({
          level,
          goal,
          hoursPerWeek,
          ...(targetIndustry.trim() ? { targetIndustry: targetIndustry.trim() } : {}),
          ...(preferredModule ? { preferredModule } : {}),
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message ?? "Erreur lors de la génération");
        return;
      }
      setRoadmap(d.roadmap);
    } catch {
      setError("Erreur réseau. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setLevel(null);
    setGoal(null);
    setHoursPerWeek(null);
    setTargetIndustry("");
    setPreferredModule("");
    setRoadmap(null);
    setError("");
  };

  if (roadmap) {
    return <RoadmapResult roadmap={roadmap} onReset={reset} />;
  }

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-2">
            Roadmap personnalisée
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Ton parcours SAP, calibré pour toi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            5 questions rapides. Un coach IA analyse ton profil et te génère un plan de modules ordonnés avec deadlines réalistes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            <span>Étape {Math.min(step + 1, totalSteps)} sur {totalSteps}</span>
            <span>{progressPercent} %</span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sap-blue"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Card with step */}
        <div className="card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <Step
                  title="Où en es-tu avec SAP aujourd'hui ?"
                  subtitle="Sois honnête — ça nous aide à doser le parcours."
                >
                  <div className="space-y-2.5">
                    {LEVELS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={level === opt.value}
                        onClick={() => setLevel(opt.value)}
                        title={opt.title}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                </Step>
              )}

              {step === 1 && (
                <Step
                  title="Quel est ton objectif principal ?"
                  subtitle="Choisis le plus proche, même s'il ne couvre pas tout."
                >
                  <div className="space-y-2.5">
                    {GOALS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        selected={goal === opt.value}
                        onClick={() => setGoal(opt.value)}
                        title={opt.title}
                        desc={opt.desc}
                      />
                    ))}
                  </div>
                </Step>
              )}

              {step === 2 && (
                <Step
                  title="Combien d'heures par semaine peux-tu y mettre ?"
                  subtitle="Réaliste, pas idéal. Le plan en dépend complètement."
                >
                  <div className="grid grid-cols-2 gap-3">
                    {HOURS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setHoursPerWeek(opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          hoursPerWeek === opt.value
                            ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
                            : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
                        }`}
                      >
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{opt.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              {step === 3 && (
                <Step
                  title="Un secteur en tête ?"
                  subtitle="Optionnel. Si tu vises retail, banque, industrie pharma, etc., on adapte."
                >
                  <input
                    type="text"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    placeholder="Ex: retail, énergie, banque, pharma, automotive..."
                    maxLength={100}
                    className="input"
                  />
                  <p className="text-xs text-slate-400 mt-2">Laisse vide si tu ne sais pas encore.</p>
                </Step>
              )}

              {step === 4 && (
                <Step
                  title="Un module qui t'attire particulièrement ?"
                  subtitle="Optionnel. On essaiera de l'intégrer, mais on garde le pouvoir de réordonner."
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPreferredModule("")}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        preferredModule === ""
                          ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
                          : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
                      }`}
                    >
                      Aucune préférence
                    </button>
                    {MODULES.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setPreferredModule(m.value)}
                        className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          preferredModule === m.value
                            ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
                            : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
                        }`}
                      >
                        <span className="block text-xs text-slate-400 mb-0.5">{m.value}</span>
                        <span className="text-slate-900 dark:text-white">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </Step>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || loading}
              className="btn-ghost"
            >
              ← Retour
            </button>

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue}
                className="btn-primary"
              >
                Continuer →
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Génération en cours…" : "Générer ma roadmap"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Powered by Claude API · La génération prend ~10-15 secondes.
        </p>
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-1.5">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  desc,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? "border-sap-blue bg-sap-blue/5 dark:bg-sap-blue/10"
          : "border-gray-200 dark:border-slate-700 hover:border-sap-blue/40 hover:bg-gray-50 dark:hover:bg-slate-800/40"
      }`}
    >
      <p className="font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{desc}</p>
    </button>
  );
}

function RoadmapResult({ roadmap, onReset }: { roadmap: Roadmap; onReset: () => void }) {
  const sortedModules = [...roadmap.modules].sort((a, b) => a.order - b.order);
  const sortedMilestones = [...roadmap.milestones].sort((a, b) => a.week - b.week);

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero result */}
        <div className="card overflow-hidden mb-6">
          <div className="bg-linear-to-br from-sap-blue-dark to-sap-blue p-8 sm:p-10 text-white">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-white/70 mb-2">
              Ta roadmap personnalisée
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 text-balance">
              {roadmap.summary}
            </h1>
            <div className="flex items-baseline gap-2 mt-5">
              <span className="text-5xl font-extrabold">{roadmap.estimatedTotalWeeks}</span>
              <span className="text-lg text-white/80">semaines au total</span>
            </div>
          </div>
        </div>

        {/* Modules ordonnés */}
        <div className="card p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
            Tes modules, dans l&apos;ordre
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Suis-les dans cet ordre pour le meilleur résultat.
          </p>

          <ol className="space-y-3">
            {sortedModules.map((m) => (
              <li
                key={m.code}
                className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/40 border border-gray-100 dark:border-slate-700"
              >
                <div className="shrink-0 h-12 w-12 rounded-xl bg-sap-blue text-white font-extrabold text-sm flex items-center justify-center">
                  {m.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Étape {m.order} · Module {m.code}
                    </p>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {m.weeks} sem.
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{m.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Milestones */}
        {sortedMilestones.length > 0 && (
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
              Jalons clés
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Les étapes qui marqueront ta progression.
            </p>
            <ul className="space-y-3 relative">
              <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-slate-700" aria-hidden />
              {sortedMilestones.map((m) => (
                <li key={`${m.week}-${m.title}`} className="flex gap-4 relative">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-white dark:bg-slate-800 border-2 border-sap-blue text-sap-blue font-extrabold text-xs flex items-center justify-center z-10">
                    S{m.week}
                  </div>
                  <div className="pt-1">
                    <p className="font-bold text-slate-900 dark:text-white">{m.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{m.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next steps */}
        <div className="card p-6 sm:p-8 mb-6 border-sap-blue/40">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
            Tu commences quoi maintenant ?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Pas demain. Pas la semaine prochaine. Aujourd&apos;hui.
          </p>
          <ol className="space-y-2.5">
            {roadmap.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/modules-sap/${sortedModules[0]?.code.toLowerCase() ?? "fi"}`}
            className="btn-primary justify-center flex-1"
          >
            Démarrer par {sortedModules[0]?.code} →
          </Link>
          <button onClick={onReset} className="btn-outline justify-center flex-1">
            Refaire le questionnaire
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Roadmap générée par Claude · Personnalisée à 100 %, pas un template.
        </p>
      </div>
    </div>
  );
}

export default function RoadmapPersonnaliseePage() {
  return (
    <ProtectedRoute>
      <RoadmapPersoContent />
    </ProtectedRoute>
  );
}
