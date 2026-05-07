"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/hooks/useProgress";

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const modules = [
  {
    slug: "fi", code: "FI", title: "Financial Accounting",
    description: "Comptabilité générale, clients, fournisseurs, immobilisations. Base de tout projet SAP via le Universal Journal (ACDOCA).",
    path: "/modules-sap/fi",
    gradient: "from-blue-500 to-blue-700",
    tags: ["Comptabilité", "Clôture", "Bilan"],
    difficulty: "Fondamental",
    diffColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    prereqs: [] as string[],
    careers: ["Consultant FI", "Analyste Finance SAP"],
    duration: "~8h",
  },
  {
    slug: "co", code: "CO", title: "Controlling",
    description: "Centres de coûts et de profit, CO-PA, CO-PC. Analyse de marge et pilotage de la performance financière interne.",
    path: "/modules-sap/co",
    gradient: "from-indigo-500 to-indigo-700",
    tags: ["Contrôle de gestion", "CO-PA", "Marges"],
    difficulty: "Intermédiaire",
    diffColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    prereqs: ["FI"],
    careers: ["Contrôleur SAP", "Consultant CO/FI"],
    duration: "~7h",
  },
  {
    slug: "mm", code: "MM", title: "Materials Management",
    description: "Approvisionnements, gestion de stock, inventaires, MRP. Socle du flux Procure-to-Pay intégré avec FI.",
    path: "/modules-sap/mm",
    gradient: "from-emerald-500 to-emerald-700",
    tags: ["Achats", "Stock", "P2P"],
    difficulty: "Fondamental",
    diffColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    prereqs: [],
    careers: ["Consultant MM", "Responsable Achats SAP"],
    duration: "~9h",
  },
  {
    slug: "sd", code: "SD", title: "Sales & Distribution",
    description: "Devis, commandes clients, livraisons, facturation, pricing conditionnel et flux Order-to-Cash complet.",
    path: "/modules-sap/sd",
    gradient: "from-amber-500 to-amber-700",
    tags: ["Ventes", "Livraison", "O2C"],
    difficulty: "Fondamental",
    diffColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    prereqs: [],
    careers: ["Consultant SD", "Gestionnaire Commercial SAP"],
    duration: "~8h",
  },
  {
    slug: "hcm", code: "HCM", title: "Human Capital Management",
    description: "Gestion administrative RH, temps, paie et organisation. Intégration FI/CO pour les écritures salariales.",
    path: "/modules-sap/hcm",
    gradient: "from-purple-500 to-purple-700",
    tags: ["RH", "Paie", "Temps"],
    difficulty: "Fondamental",
    diffColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    prereqs: [],
    careers: ["Consultant HCM", "Gestionnaire Paie SAP"],
    duration: "~6h",
  },
  {
    slug: "pp", code: "PP", title: "Production Planning",
    description: "Planification des besoins (MRP), ordres de fabrication, suivi d'atelier MES. Intégration forte MM et CO.",
    path: "/modules-sap/pp",
    gradient: "from-rose-500 to-rose-700",
    tags: ["Fabrication", "MRP", "Atelier"],
    difficulty: "Avancé",
    diffColor: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
    prereqs: ["MM", "CO"],
    careers: ["Consultant PP", "Planificateur SAP"],
    duration: "~10h",
  },
];

const RECOMMENDED_ORDER = ["fi", "mm", "sd", "co", "hcm", "pp"];
const DIFFICULTIES = ["Tous", "Fondamental", "Intermédiaire", "Avancé"];

const stats = [
  { value: "6",    label: "Modules fonctionnels" },
  { value: "48h+", label: "Contenu estimé" },
  { value: "200+", label: "T-codes couverts" },
  { value: "3",    label: "Flux métier (P2P · O2C · R2R)" },
];

export default function ModulesOverview() {
  const { isAuthenticated } = useAuth();
  const { isVisited } = useProgress();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("Tous");

  const filtered = modules.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      m.code.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q));
    const matchDiff = difficulty === "Tous" || m.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <>
      {/* Hero */}
      <div className="bg-linear-to-br from-sap-blue-dark to-sap-blue py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-3"
          >
            Catalogue
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
          >
            Modules SAP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-blue-100 max-w-xl mx-auto text-base mb-10"
          >
            Les 6 modules fonctionnels clés que tu rencontreras sur les projets SAP.
            Retrouve la difficulté, les prérequis et le parcours conseillé.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 min-w-[110px]">
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-[11px] text-blue-200 mt-0.5 leading-snug">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filtres sticky */}
      <div className="sticky top-[4.5rem] z-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un module, tag…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-sap-blue/40 placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  difficulty === d
                    ? "bg-sap-blue text-white"
                    : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base font-medium mb-2">Aucun module correspondant</p>
            <button
              onClick={() => { setSearch(""); setDifficulty("Tous"); }}
              className="text-sm text-sap-blue dark:text-sap-accent hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m, i) => {
              const visited = isAuthenticated && isVisited(m.slug);
              return (
                <motion.div
                  key={m.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.06 * i }}
                >
                  <Link
                    href={m.path}
                    className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border
                               border-gray-100 dark:border-slate-700 overflow-hidden
                               hover:shadow-medium hover:-translate-y-1 transition-all duration-300 relative"
                  >
                    {visited && (
                      <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1
                                       bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <CheckIcon /> Visité
                      </span>
                    )}

                    <div className={`bg-linear-to-r ${m.gradient} px-6 py-5 flex items-center gap-4`}>
                      <span className="text-3xl font-extrabold text-white/90 font-mono">{m.code}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">{m.title}</p>
                        <span className="text-white/70 text-[10px] flex items-center gap-1 mt-0.5">
                          <ClockIcon /> {m.duration}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1">
                        {m.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.diffColor}`}>
                          {m.difficulty}
                        </span>
                        {m.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {m.prereqs.length > 0 && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                          Prérequis :{" "}
                          <span className="font-semibold text-slate-500 dark:text-slate-400">
                            {m.prereqs.join(", ")}
                          </span>
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4 leading-snug">
                        {m.careers.join(" · ")}
                      </p>

                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-sap-blue dark:text-sap-accent group-hover:gap-2.5 transition-all">
                        Voir le module <ArrowRight />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Parcours recommandé */}
      <div className="bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Parcours recommandé
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Ordre conseillé pour progresser efficacement et comprendre les intégrations entre modules.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {RECOMMENDED_ORDER.map((slug, idx) => {
              const mod = modules.find((m) => m.slug === slug)!;
              const visited = isAuthenticated && isVisited(slug);
              return (
                <div key={slug} className="flex items-center gap-2">
                  <Link
                    href={mod.path}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium
                                transition-all hover:shadow-sm hover:-translate-y-0.5
                                ${visited
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700/50 dark:text-emerald-400"
                                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sap-blue/40"
                                }`}
                  >
                    {visited && <CheckIcon />}
                    <span className="font-bold">{mod.code}</span>
                    <span className="hidden sm:inline text-xs opacity-60">
                      — {mod.title.split(" ")[0]}
                    </span>
                  </Link>
                  {idx < RECOMMENDED_ORDER.length - 1 && (
                    <span className="text-slate-300 dark:text-slate-600 font-light select-none">→</span>
                  )}
                </div>
              );
            })}
          </div>

          {!isAuthenticated && (
            <p className="mt-5 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/register" className="text-sap-blue dark:text-sap-accent hover:underline font-medium">
                Crée un compte gratuit
              </Link>{" "}
              pour suivre ta progression dans ce parcours.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
