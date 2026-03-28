import { motion } from "motion/react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

// --- Icônes SVG ---
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// --- Données ---
const stats = [
  { value: "6",    label: "Modules SAP" },
  { value: "50+",  label: "Concepts clés" },
  { value: "100%", label: "Gratuit" },
  { value: "1",    label: "Plateforme unifiée" },
];

const features = [
  {
    icon: <BookIcon />,
    title: "Contenu structuré",
    description: "Chaque module SAP (FI, CO, MM, SD, HCM, PP) est présenté de façon claire, avec les concepts fondamentaux et les intégrations clés.",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: <ChartIcon />,
    title: "Suivi de progression",
    description: "Track ton avancement module par module. Visualise ce que tu as déjà maîtrisé et ce qu'il te reste à explorer.",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: <TargetIcon />,
    title: "Roadmap consultant",
    description: "Génère une roadmap personnalisée selon ton profil cible : Finance, Supply Chain, RH ou IA & Joule.",
    color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    icon: <ZapIcon />,
    title: "S/4HANA & IA Joule",
    description: "Au-delà des modules classiques, plonge dans S/4HANA, l'Universal Journal, Fiori UX et l'IA intégrée SAP.",
    color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

const modules = [
  { code: "FI",  name: "Financial Accounting", path: "/modules-sap/fi",  color: "from-blue-500 to-blue-700",     desc: "Comptabilité générale, clients, fournisseurs" },
  { code: "CO",  name: "Controlling",          path: "/modules-sap/co",  color: "from-indigo-500 to-indigo-700", desc: "Centres de coûts, CO-PA, marge analytique" },
  { code: "MM",  name: "Materials Mgmt",       path: "/modules-sap/mm",  color: "from-emerald-500 to-emerald-700",desc: "Achats, stocks, MRP, Procure-to-Pay" },
  { code: "SD",  name: "Sales & Distribution", path: "/modules-sap/sd",  color: "from-orange-500 to-orange-700", desc: "Devis, livraisons, Order-to-Cash" },
  { code: "HCM", name: "Human Capital Mgmt",   path: "/modules-sap/hcm", color: "from-purple-500 to-purple-700", desc: "RH, paie, temps, organisation" },
  { code: "PP",  name: "Production Planning",  path: "/modules-sap/pp",  color: "from-rose-500 to-rose-700",     desc: "Ordres de fabrication, MRP, atelier" },
];

const perks = [
  "Contenu rédigé par un consultant SAP",
  "Modules FI, CO, MM, SD, HCM, PP",
  "S/4HANA & IA Joule couverts",
  "Roadmap personnalisée",
  "Dashboard de progression",
  "100% gratuit",
];

// --- Animation variants ---
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

const Home = () => (
  <>
    <SEO
      title="HanaFlow"
      description="Master SAP Learning Platform — Apprends FI, CO, MM, SD, HCM, PP et S/4HANA avec une plateforme éducative premium."
      path="/"
    />

    {/* ===== HERO ===== */}
    <section className="relative overflow-hidden bg-gradient-to-br from-sapBlueDark via-sapBlue to-sapAccent">
      {/* Motif décoratif */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        <motion.div {...fadeUp(0)}>
          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/30">
            Master SAP Learning Platform
          </span>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 text-balance leading-tight">
          Maîtrise SAP S/4HANA{" "}
          <span className="text-sapAccent opacity-90">de zéro à consultant</span>
        </motion.h1>

        <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          La plateforme éducative de référence pour apprendre les modules SAP, comprendre S/4HANA et construire une carrière de consultant.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/modules-sap"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-sapBlue
                       text-sm font-bold shadow-large hover:bg-blue-50 transition-all duration-150
                       active:scale-[0.98]"
          >
            Explorer les modules SAP
            <ArrowRight />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-white/50
                       text-white text-sm font-bold hover:bg-white/10 transition-all duration-150
                       active:scale-[0.98]"
          >
            Créer un compte gratuit
          </Link>
        </motion.div>
      </div>
    </section>

    {/* ===== STATS ===== */}
    <section className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== MODULES GRID ===== */}
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            6 modules SAP couverts
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Des fiches complètes sur chaque module fonctionnel, avec les flux, les tables clés et les intégrations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => (
            <motion.div key={m.code} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 * i }}>
              <Link
                to={m.path}
                className="group flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border
                           border-gray-100 dark:border-slate-700 p-6 hover:shadow-medium
                           hover:-translate-y-0.5 transition-all duration-300 overflow-hidden relative"
              >
                {/* Badge code module */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} text-white font-bold text-base shadow-soft mb-4 flex-shrink-0`}>
                  {m.code}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sapBlue dark:group-hover:text-sapAccent transition-colors">
                  {m.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {m.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sapBlue dark:text-sapAccent opacity-0 group-hover:opacity-100 transition-opacity">
                  Accéder au module <ArrowRight />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== FEATURES ===== */}
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Pourquoi HanaFlow ?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Une plateforme pensée pour les consultants juniors et les étudiants qui veulent apprendre SAP sérieusement.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="flex flex-col bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border
                         border-gray-100 dark:border-slate-700"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.color} mb-4 flex-shrink-0`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== CTA SECTION ===== */}
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-sapBlueDark via-sapBlue to-sapAccent rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Commence gratuitement aujourd'hui
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Crée ton compte, accède à tous les modules SAP et suis ta progression vers une carrière de consultant.
            </p>

            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="text-emerald-400"><CheckIcon /></span>
                  {p}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-sapBlue
                           text-sm font-bold shadow-large hover:bg-blue-50 transition-all active:scale-[0.98]"
              >
                Créer mon compte — Gratuit
                <ArrowRight />
              </Link>
              <Link
                to="/modules-sap"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-white/40
                           text-white text-sm font-semibold hover:bg-white/10 transition-all"
              >
                Explorer sans compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Home;
