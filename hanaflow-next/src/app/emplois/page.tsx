"use client";

import { useEffect, useState } from "react";
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

export default function EmploisPage() {
  const { isPro } = useSubscription();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState("");
  const [seniorityFilter, setSeniorityFilter] = useState("");

  const loadJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (moduleFilter) params.set("module", moduleFilter);
    if (seniorityFilter) params.set("seniority", seniorityFilter);
    try {
      const r = await fetch(`/api/jobs?${params.toString()}`);
      const d = await r.json();
      setJobs(d.jobs ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, [moduleFilter, seniorityFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Opportunités SAP
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Postule directement avec le CV optimisé par notre IA.
          </p>
        </div>

        {!isPro && (
          <div className="relative overflow-hidden rounded-2xl mb-10 p-6 sm:p-7 bg-linear-to-br from-sap-blue-dark via-sap-blue to-sap-400 shadow-large">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" aria-hidden />
            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between">
              <div className="text-center sm:text-left">
                <p className="text-white font-bold text-lg">
                  {jobs.length > 0
                    ? `Vois les ${jobs.length} offre${jobs.length > 1 ? "s" : ""} ouvertes — candidate avec ton CV IA`
                    : "Candidate en un clic avec ton CV IA"}
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

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="">Tous les modules</option>
            {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="">Toute séniorité</option>
            {SENIORITIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-sap-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Aucune offre pour l&apos;instant — reviens bientôt.</div>
        ) : (
          <div className="space-y-3">
            {jobs.map((j) => (
              <Link
                key={j.id}
                href={`/emplois/${j.id}`}
                className="block bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-5 hover:border-sap-blue/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-bold text-slate-900 dark:text-white">{j.title}</h2>
                      {j.isFeatured && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 uppercase tracking-wider">
                          À la une
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {j.companyName}{j.companyName && j.location ? " · " : ""}{j.location}
                      {j.workMode ? ` · ${WORK_MODE_LABELS[j.workMode] ?? j.workMode}` : ""}
                    </p>
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
        )}
      </div>
    </div>
  );
}
