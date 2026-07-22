"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSubscription } from "@/context/SubscriptionContext";

type Job = {
  id: number;
  title: string;
  companyName: string | null;
  moduleCode: string | null;
  seniority: string | null;
  location: string | null;
  workMode: string | null;
  contractType: string | null;
  isFeatured: boolean;
  createdAt: string;
};

const MODULES = ["FI", "CO", "MM", "SD", "PP", "AI"];
const SENIORITIES: Array<{ value: string; label: string }> = [
  { value: "junior", label: "Junior" },
  { value: "confirmed", label: "Confirmé" },
  { value: "senior", label: "Senior" },
];
const WORK_MODE_LABELS: Record<string, string> = { remote: "Remote", hybrid: "Hybride", onsite: "Sur site" };
const CONTRACT_LABELS: Record<string, string> = { cdi: "CDI", cdd: "CDD", freelance: "Freelance" };
const SENIORITY_LABELS: Record<string, string> = { junior: "Junior", confirmed: "Confirmé", senior: "Senior" };

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "Publiée aujourd'hui";
  if (days === 1) return "Publiée hier";
  if (days < 30) return `Publiée il y a ${days} j`;
  const months = Math.floor(days / 30);
  return `Publiée il y a ${months} mois`;
}

const STEPS = [
  {
    n: "1",
    title: "Construis ton CV avec l'IA",
    desc: "Renseigne ton parcours, l'IA le structure et l'optimise pour les filtres ATS des recruteurs.",
  },
  {
    n: "2",
    title: "Filtre les offres par module",
    desc: "FI, CO, MM, SD, PP ou S/4HANA — ne consulte que les postes qui correspondent à ta spécialité.",
  },
  {
    n: "3",
    title: "Postule en un clic",
    desc: "Ton CV optimisé est transmis directement, sans ressaisie. Le suivi se fait depuis ton profil.",
  },
];

export default function EmploisPage() {
  const { isPro } = useSubscription();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("");
  const [seniorityFilter, setSeniorityFilter] = useState("");
  // Compte total (non filtré) du pool d'offres — sert à savoir si des offres existent
  // en base indépendamment des filtres, pour ne pas afficher de filtres/upsell morts
  // tant qu'aucune offre n'existe. Dérivé du premier fetch non filtré (voir loadJobs) :
  // pas de fetch dédié, on réutilise l'appel déjà nécessaire pour afficher la liste.
  const [totalJobsCount, setTotalJobsCount] = useState<number | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (moduleFilter) params.set("module", moduleFilter);
    if (seniorityFilter) params.set("seniority", seniorityFilter);
    const isUnfiltered = !moduleFilter && !seniorityFilter;
    try {
      const r = await fetch(`/api/jobs?${params.toString()}`);
      const d = await r.json();
      const list = d.jobs ?? [];
      setJobs(list);
      if (isUnfiltered) setTotalJobsCount(list.length);
    } catch {
      if (isUnfiltered) setTotalJobsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, [moduleFilter, seniorityFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasJobsInPool = (totalJobsCount ?? 0) > 0;

  const hasActiveFilters = Boolean(moduleFilter || seniorityFilter);
  const resetFilters = () => { setModuleFilter(""); setSeniorityFilter(""); };

  const featuredCount = useMemo(() => jobs.filter((j) => j.isFeatured).length, [jobs]);

  return (
    <div className="bg-sap-gray-light dark:bg-sap-dark py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-wider uppercase text-sap-blue bg-sap-blue/10 rounded-full px-3 py-1 mb-4">
            Passerelle emploi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
            Des offres SAP, pas des offres génériques
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Missions et postes filtrés par module (FI, CO, MM, SD, PP, S/4HANA). Postule avec le CV
            que notre IA a déjà optimisé pour passer les filtres ATS des recruteurs.
          </p>
        </div>

        {!isPro && !loading && jobs.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl mb-10 p-6 sm:p-7 bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 shadow-large">
            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-lg">
                  {`${jobs.length} offre${jobs.length > 1 ? "s" : ""} ouverte${jobs.length > 1 ? "s" : ""} — candidate en un clic avec ton CV IA`}
                </p>
                <p className="text-white/80 text-sm mt-1">
                  Réservé aux membres Pro : CV optimisé ATS déjà prêt, candidature transmise sans ressaisie.
                </p>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-sap-blue-dark font-bold hover:shadow-[0_8px_24px_rgba(15,23,42,0.25)] transition-all active:scale-[0.98]"
              >
                Activer le plan Pro →
              </Link>
            </div>
          </div>
        )}

        {hasJobsInPool && (
        <div className="flex flex-wrap items-center gap-2 justify-center mb-8">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            aria-label="Filtrer par module SAP"
            className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue cursor-pointer"
          >
            <option value="">Tous les modules</option>
            {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            aria-label="Filtrer par séniorité"
            className="px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sap-blue/40 focus:border-sap-blue cursor-pointer"
          >
            <option value="">Toute séniorité</option>
            {SENIORITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-sap-blue transition-colors"
            >
              Réinitialiser ×
            </button>
          )}
        </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState hasActiveFilters={hasActiveFilters} onReset={resetFilters} />
        ) : (
          <>
            {featuredCount > 0 && (
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-3 px-1">
                {jobs.length} offre{jobs.length > 1 ? "s" : ""} · {featuredCount} à la une
              </p>
            )}
            <div className="space-y-3">
              {jobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/emplois/${j.id}`}
                  className="card-interactive group block p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-sap-blue transition-colors">
                          {j.title}
                        </h2>
                        {j.isFeatured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 uppercase tracking-wider">
                            À la une
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {j.companyName ?? "Entreprise confidentielle"}
                        {j.location ? ` · ${j.location}` : ""}
                        {j.workMode ? ` · ${WORK_MODE_LABELS[j.workMode] ?? j.workMode}` : ""}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {j.seniority && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                            {SENIORITY_LABELS[j.seniority] ?? j.seniority}
                          </span>
                        )}
                        {j.contractType && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                            {CONTRACT_LABELS[j.contractType] ?? j.contractType}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-500">{timeAgo(j.createdAt)}</span>
                      </div>
                    </div>
                    {j.moduleCode && (
                      <span className="shrink-0 text-xs font-bold px-2 py-1 rounded-lg bg-sap-blue/10 text-sap-blue">
                        {j.moduleCode}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ hasActiveFilters, onReset }: { hasActiveFilters: boolean; onReset: () => void }) {
  if (hasActiveFilters) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400 mb-3">
          Aucune offre ne correspond à ces filtres pour l&apos;instant.
        </p>
        <button onClick={onReset} className="text-sap-blue font-semibold hover:underline">
          Voir toutes les offres
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center py-10">
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Aucune offre publiée pour l&apos;instant — la sélection démarre bientôt. En attendant,
          prépare ton CV pour candidater dès la première mise en ligne.
        </p>
        <Link href="/cv-builder" className="btn-primary mt-5">
          Créer mon CV IA →
        </Link>
      </div>

      <div className="mt-8 pt-10 border-t border-gray-100 dark:border-slate-800">
        <h2 className="text-center text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-8">
          Comment ça marche
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-sap-blue/10 text-sap-blue font-bold text-sm flex items-center justify-center mx-auto sm:mx-0 mb-3">
                {s.n}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Reviens régulièrement — de nouvelles offres arrivent chaque semaine.
        </p>
        <Link href="/pricing" className="inline-block mt-3 text-sm font-semibold text-sap-blue hover:underline">
          Voir les avantages du plan Pro →
        </Link>
      </div>
    </div>
  );
}
