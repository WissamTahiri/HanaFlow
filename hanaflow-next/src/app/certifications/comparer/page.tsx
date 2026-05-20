"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import certCatalog from "@/data/cert-catalog.json";

/**
 * Comparateur de certifs SAP — page interactive.
 *
 * 3 vues :
 *  1. Tableau comparatif complet (toutes colonnes vs tous modules)
 *  2. Filtre par rôle cible (« Pour devenir consultant FI junior… »)
 *  3. Card de détail au focus
 *
 * Data : src/data/cert-catalog.json (mis à jour auto par scripts/sap-cert-watch.mjs)
 */

type Module = (typeof certCatalog.modules)[number];

const ALL_ROLES_LABEL = "Tous les profils";

function uniqueRoles(modules: Module[]): string[] {
  const set = new Set<string>();
  modules.forEach((m) => m.targetRoles?.forEach((r) => set.add(r)));
  return [ALL_ROLES_LABEL, ...Array.from(set).sort()];
}

export default function CompararePage() {
  const modules = certCatalog.modules;
  const roles = useMemo(() => uniqueRoles(modules), [modules]);
  const [roleFilter, setRoleFilter] = useState<string>(ALL_ROLES_LABEL);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (roleFilter === ALL_ROLES_LABEL) return modules;
    return modules.filter((m) => m.targetRoles?.includes(roleFilter));
  }, [modules, roleFilter]);

  const selected = useMemo(
    () => modules.find((m) => m.code === selectedCode) ?? null,
    [modules, selectedCode],
  );

  return (
    <div className="min-h-screen bg-sap-gray-light dark:bg-sap-dark py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-sap-blue mb-3">
            Comparateur
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 text-balance">
            Quelle certification SAP viser ?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Compare les {modules.length} certifs SAP que HanaFlow prépare, filtre par rôle visé,
            et vois exactement ce que tu vas étudier.
          </p>
        </div>

        {/* Filtre par rôle */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                roleFilter === r
                  ? "bg-sap-blue text-white shadow-soft"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-sap-blue/40"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Tableau comparatif */}
        <div className="card overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-gray-50 dark:bg-slate-800 z-10">
                    Module
                  </th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300">Code certif</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300">Niveau</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300">Durée</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300">Score requis</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300">Prix SAP</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300">Format</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700 dark:text-slate-300"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <motion.tr
                    key={m.code}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedCode(m.code === selectedCode ? null : m.code)}
                  >
                    <td className="py-4 px-5 sticky left-0 bg-white dark:bg-slate-900 z-10">
                      <div className="flex items-center gap-3">
                        <span className={`h-10 w-10 rounded-xl bg-linear-to-br ${m.color} flex items-center justify-center text-white font-extrabold text-xs shadow-soft`}>
                          {m.code}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{m.chapters} chapitres HanaFlow</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent">
                        {m.cert}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400">{m.level}</td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400">{m.durationMin} min</td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400">{m.passingScore} %</td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400">{m.priceEur} €</td>
                    <td className="py-4 px-5 text-slate-600 dark:text-slate-400 text-xs">{m.format}</td>
                    <td className="py-4 px-5">
                      <span className="text-sap-blue dark:text-sap-accent text-xs font-semibold">
                        {selectedCode === m.code ? "Fermer ↑" : "Détails ↓"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card de détail si une certif est sélectionnée */}
        {selected && (
          <motion.div
            key={selected.code}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card overflow-hidden mb-12"
          >
            <div className={`bg-linear-to-br ${selected.color} px-8 py-6 text-white`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/70">Module {selected.code}</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">{selected.name}</h2>
                  <p className="text-white/85 mt-2">{selected.certName}</p>
                </div>
                <span className="shrink-0 font-mono text-xs px-3 py-1.5 rounded-md bg-white/20 backdrop-blur-sm">
                  {selected.cert}
                </span>
              </div>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-4">
                  Sujets clés de l&apos;examen
                </h3>
                <ul className="space-y-2.5">
                  {selected.topics?.map((t) => (
                    <li key={t} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <svg className="shrink-0 mt-0.5 text-sap-blue" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 mb-4">
                  Public cible
                </h3>
                <ul className="space-y-2.5 mb-6">
                  {selected.targetRoles?.map((r) => (
                    <li key={r} className="text-sm text-slate-700 dark:text-slate-300 inline-block mr-2 mb-2 px-3 py-1.5 rounded-full bg-sap-blue/10 text-sap-blue dark:bg-sap-blue/20 dark:text-sap-accent font-medium">
                      {r}
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Questions officielles</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{selected.officialQuestions}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">HanaFlow simulateur</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{selected.questions}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={selected.href} className="btn-primary justify-center flex-1">
                    Étudier le module {selected.code} →
                  </Link>
                  <a
                    href={selected.certSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline justify-center flex-1"
                  >
                    Voir la fiche SAP officielle
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer + CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Tarifs et durées d&apos;examen indicatifs (mai 2026). Vérifie sur{" "}
            <a href="https://learning.sap.com/certifications" target="_blank" rel="noopener noreferrer" className="underline hover:text-sap-blue">
              learning.sap.com
            </a>{" "}
            au moment de t&apos;inscrire — SAP met à jour les conditions plusieurs fois par an. HanaFlow
            n&apos;est pas affilié à SAP SE et ne délivre pas les certifs officielles.
          </p>

          <div className="card p-8 sm:p-10 text-center bg-linear-to-br from-sap-blue-dark to-sap-blue text-white border-0">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Pas sûr laquelle choisir ?
            </h2>
            <p className="text-white/85 mb-6 max-w-xl mx-auto">
              Le roadmap personnalisé HanaFlow te propose un parcours en fonction de ton objectif
              (consultant junior, indep, lead architect…) en 30 secondes.
            </p>
            <Link
              href="/roadmap-personnalisee"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-sap-blue font-bold hover:bg-slate-100 transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
            >
              Générer ma roadmap →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
