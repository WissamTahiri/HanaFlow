import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";
import SEO from "../components/SEO";

gsap.registerPlugin(ScrollTrigger);

/* ─── Icônes ──────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ─── Données ─────────────────────────────────────────────── */
const modules = [
  { slug: "fi",  code: "FI",  title: "Financial Accounting",    path: "/modules-sap/fi",  accent: "#3B82F6",
    desc: "Comptabilité générale, clients, fournisseurs, immobilisations. Base de tout projet SAP.",
    tags: ["Comptabilité", "Clôture", "Bilan"], difficulty: "Fondamental", prereqs: [], duration: "~8h",
    careers: ["Consultant FI", "Analyste Finance SAP"] },
  { slug: "co",  code: "CO",  title: "Controlling",             path: "/modules-sap/co",  accent: "#8B5CF6",
    desc: "Centres de coûts et de profit, CO-PA, CO-PC. Analyse de marge et pilotage interne.",
    tags: ["Contrôle de gestion", "CO-PA", "Marges"], difficulty: "Intermédiaire", prereqs: ["FI"], duration: "~7h",
    careers: ["Contrôleur SAP", "Consultant CO/FI"] },
  { slug: "mm",  code: "MM",  title: "Materials Management",    path: "/modules-sap/mm",  accent: "#10B981",
    desc: "Approvisionnements, stocks, MRP. Socle du flux Procure-to-Pay intégré avec FI.",
    tags: ["Achats", "Stock", "P2P"], difficulty: "Fondamental", prereqs: [], duration: "~9h",
    careers: ["Consultant MM", "Responsable Achats SAP"] },
  { slug: "sd",  code: "SD",  title: "Sales & Distribution",    path: "/modules-sap/sd",  accent: "#F59E0B",
    desc: "Devis, commandes, livraisons, facturation. Flux Order-to-Cash complet.",
    tags: ["Ventes", "Livraison", "O2C"], difficulty: "Fondamental", prereqs: [], duration: "~8h",
    careers: ["Consultant SD", "Gestionnaire Commercial SAP"] },
  { slug: "hcm", code: "HCM", title: "Human Capital Mgmt",      path: "/modules-sap/hcm", accent: "#EC4899",
    desc: "Gestion RH, temps, paie, organisation. Intégration FI/CO pour les écritures salariales.",
    tags: ["RH", "Paie", "Temps"], difficulty: "Fondamental", prereqs: [], duration: "~6h",
    careers: ["Consultant HCM", "Gestionnaire Paie SAP"] },
  { slug: "pp",  code: "PP",  title: "Production Planning",     path: "/modules-sap/pp",  accent: "#EF4444",
    desc: "MRP, ordres de fabrication, suivi d'atelier. Intégration forte MM et CO.",
    tags: ["Fabrication", "MRP", "Atelier"], difficulty: "Avancé", prereqs: ["MM", "CO"], duration: "~10h",
    careers: ["Consultant PP", "Planificateur SAP"] },
];

const DIFFICULTIES = ["Tous", "Fondamental", "Intermédiaire", "Avancé"];
const RECOMMENDED  = ["fi", "mm", "sd", "co", "hcm", "pp"];

const diffStyle = {
  "Fondamental":   "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Intermédiaire": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Avancé":        "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

export default function ModulesOverview() {
  const { isAuthenticated } = useAuth();
  const { isVisited }       = useProgress();
  const [search,     setSearch]     = useState("");
  const [difficulty, setDifficulty] = useState("Tous");
  const cardsRef = useRef(null);

  const filtered = modules.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !search || m.code.toLowerCase().includes(q) || m.title.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q));
    const matchDiff   = difficulty === "Tous" || m.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".module-card", {
        opacity: 0, y: 24, stagger: 0.08, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: cardsRef.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO title="Modules SAP" description="Panorama des 6 modules SAP : FI, CO, MM, SD, HCM, PP." path="/modules-sap" />

      {/* ── Hero dark ──────────────────────────────────────── */}
      <section className="grain relative bg-slate-950 pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[300px] rounded-full bg-sapBlue/15 blur-[100px]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-sapBlue uppercase tracking-widest mb-4">Curriculum</p>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white tracking-display mb-5">
            Modules SAP
          </h1>
          <p className="text-slate-400 max-w-xl text-base leading-relaxed mb-12">
            Les 6 modules fonctionnels que tu rencontreras sur chaque projet SAP — avec difficulté, prérequis et parcours recommandé.
          </p>

          {/* Stats inline */}
          <div className="flex flex-wrap gap-4">
            {[
              { v: "6",    l: "Modules" },
              { v: "48h+", l: "Contenu" },
              { v: "200+", l: "T-codes" },
              { v: "3",    l: "Flux métier" },
            ].map(({ v, l }) => (
              <div key={l} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/8">
                <span className="font-display text-xl font-bold text-white">{v}</span>
                <span className="text-xs text-slate-500">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filtres sticky ─────────────────────────────────── */}
      <div className="sticky top-[4.5rem] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><SearchIcon /></span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Module, tag…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700
                         bg-white dark:bg-slate-800 text-slate-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-sapBlue/30 placeholder:text-slate-400" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  difficulty === d
                    ? "bg-sapBlue text-white shadow-sm"
                    : "bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grille modules ─────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-slate-950 min-h-[40vh]">
        <div ref={cardsRef} className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg font-medium mb-3">Aucun module correspondant</p>
              <button onClick={() => { setSearch(""); setDifficulty("Tous"); }}
                className="text-sm text-sapBlue dark:text-sapAccent hover:underline">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((m) => {
                const visited = isAuthenticated && isVisited(m.slug);
                return (
                  <Link key={m.code} to={m.path}
                    className="module-card group relative flex flex-col bg-white dark:bg-slate-900
                               rounded-2xl border border-gray-100 dark:border-slate-800
                               hover:border-opacity-0 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]
                               hover:-translate-y-1 transition-all duration-300 overflow-hidden">

                    {/* Glow hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{ background: `radial-gradient(ellipse at 50% 0%, ${m.accent}12, transparent 70%)` }} />

                    {/* Badge visité */}
                    {visited && (
                      <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1
                                       bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        <CheckIcon /> Visité
                      </span>
                    )}

                    {/* Header */}
                    <div className="relative px-6 pt-6 pb-4 flex items-center gap-4">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-sm font-bold flex-shrink-0"
                        style={{ background: `${m.accent}18`, color: m.accent }}>
                        {m.code}
                      </span>
                      <div>
                        <p className="font-display font-semibold text-slate-900 dark:text-white text-sm tracking-tight-xl">
                          {m.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.duration}</p>
                      </div>
                    </div>

                    {/* Corps */}
                    <div className="relative px-6 pb-6 flex flex-col flex-1 gap-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{m.desc}</p>

                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diffStyle[m.difficulty]}`}>
                          {m.difficulty}
                        </span>
                        {m.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {m.prereqs.length > 0 && (
                        <p className="text-xs text-slate-400">
                          Prérequis : <span className="font-medium text-slate-500 dark:text-slate-300">{m.prereqs.join(", ")}</span>
                        </p>
                      )}

                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200"
                        style={{ color: m.accent }}>
                        Voir le module <ArrowRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Parcours recommandé ───────────────────────────── */}
        <div className="border-t border-gray-100 dark:border-slate-800 py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-1 tracking-tight-xl">
              Parcours recommandé
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Ordre conseillé pour progresser efficacement et saisir les intégrations inter-modules.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {RECOMMENDED.map((slug, idx) => {
                const mod     = modules.find((m) => m.slug === slug);
                const visited = isAuthenticated && isVisited(slug);
                return (
                  <div key={slug} className="flex items-center gap-2">
                    <Link to={mod.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all hover:-translate-y-0.5
                                  ${visited
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700/40 dark:text-emerald-400"
                                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-sapBlue/40"
                                  }`}>
                      {visited && <CheckIcon />}
                      <span className="font-bold" style={{ color: visited ? undefined : modules.find(m => m.slug === slug)?.accent }}>
                        {mod.code}
                      </span>
                      <span className="hidden sm:inline text-xs opacity-50">— {mod.title.split(" ")[0]}</span>
                    </Link>
                    {idx < RECOMMENDED.length - 1 && (
                      <span className="text-slate-300 dark:text-slate-700 select-none">→</span>
                    )}
                  </div>
                );
              })}
            </div>
            {!isAuthenticated && (
              <p className="mt-4 text-xs text-slate-400">
                <Link to="/register" className="text-sapBlue dark:text-sapAccent hover:underline font-medium">
                  Crée un compte gratuit
                </Link>{" "}pour suivre ta progression.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
