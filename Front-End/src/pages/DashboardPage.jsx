import { useMemo } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress, SAP_MODULES } from "../hooks/useProgress";
import { useSubscription } from "../context/SubscriptionContext";
import SEO from "../components/SEO";

/* ─── Icônes ──────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ExternalLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const AwardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

/* ─── Données ─────────────────────────────────────────────── */
const RECOMMENDED_ORDER = ["fi", "mm", "sd", "co", "hcm", "pp"];
const FI_TOTAL_LESSONS = 14;

const quickLinks = [
  { to: "/s4hana",           label: "S/4HANA",         color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  { to: "/ai-joule",         label: "SAP AI Joule",     color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
  { to: "/processus-metier", label: "Processus",        color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" },
  { to: "/roadmap",          label: "Ma Roadmap",       color: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
];

/* ─── Composant ───────────────────────────────────────────── */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isVisited, visitedCount, totalModules, percentage, loading, progress } = useProgress();
  const { isPro, plan, upgradeToPro } = useSubscription();

  /* Leçons FI complétées (localStorage) */
  const fiLessonsCompleted = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hanaflow_fi_lessons") || "[]");
      return Array.isArray(saved) ? saved.length : 0;
    } catch { return 0; }
  }, []);

  /* Prochain module recommandé non visité */
  const nextSlug = useMemo(
    () => RECOMMENDED_ORDER.find((s) => !isVisited(s)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress]
  );
  const nextModule = nextSlug ? SAP_MODULES.find((m) => m.slug === nextSlug) : null;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <SEO title="Dashboard" description="Votre espace personnel HanaFlow — suivez votre progression SAP." path="/dashboard" />

      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sapDark py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ── Header utilisateur ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sapBlue to-sapBlueDark
                                flex items-center justify-center text-white font-bold text-lg shadow-soft flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Bonjour, {user?.name} 👋
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="badge-blue">
                      {user?.role === "student" ? "Étudiant SAP" : user?.role}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full
                                      ${isPro
                                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                                        : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"
                                      }`}>
                      {isPro ? <><StarIcon /> Pro</> : "Free"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/profil" className="btn-ghost text-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600">
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-500 border border-red-200 dark:border-red-800
                             rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Cartes de stats ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {/* Modules */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-sapBlue/10 dark:bg-sapBlue/20 flex items-center justify-center text-sapBlue dark:text-sapAccent">
                  <BookIcon />
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Modules SAP</span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {loading ? "—" : visitedCount}
                <span className="text-base font-normal text-slate-400 ml-1">/ {totalModules}</span>
              </p>
              <div className="mt-3 w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-sapBlue to-sapAccent"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-400">{percentage}% complété</p>
            </div>

            {/* Certification FI */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <AwardIcon />
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Certif. FI</span>
              </div>
              {fiLessonsCompleted > 0 ? (
                <>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {fiLessonsCompleted}
                    <span className="text-base font-normal text-slate-400 ml-1">/ {FI_TOTAL_LESSONS}</span>
                  </p>
                  <div className="mt-3 w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((fiLessonsCompleted / FI_TOTAL_LESSONS) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">leçons complétées</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Non débuté</p>
                  <Link
                    to="/certifications/fi"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sapBlue dark:text-sapAccent hover:underline"
                  >
                    Commencer la préparation <ArrowRight />
                  </Link>
                </>
              )}
            </div>

            {/* Plan */}
            <div className={`rounded-2xl border shadow-card p-5
                             ${isPro
                               ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/10 dark:to-orange-900/10 dark:border-amber-700/40"
                               : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700"
                             }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center
                                 ${isPro ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                         : "bg-gray-100 dark:bg-slate-700 text-slate-400"}`}>
                  <ZapIcon />
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Ton plan</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {isPro ? "Pro" : "Gratuit"}
              </p>
              {isPro ? (
                <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Accès complet à toutes les certifications
                </p>
              ) : (
                <>
                  <p className="mt-1.5 text-xs text-slate-400">Chapitre 1 FI débloqué</p>
                  <button
                    onClick={upgradeToPro}
                    className="mt-3 text-xs font-semibold text-sapBlue dark:text-sapAccent hover:underline inline-flex items-center gap-1"
                  >
                    Passer à Pro <ArrowRight />
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* ── Prochaine étape ─────────────────────────────── */}
          {nextModule && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
            >
              <Link
                to={nextModule.path}
                className="flex items-center justify-between gap-4 bg-gradient-to-r from-sapBlue to-sapBlueDark
                           rounded-2xl p-5 shadow-card group hover:shadow-medium hover:-translate-y-0.5 transition-all"
              >
                <div>
                  <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">
                    Prochaine étape recommandée
                  </p>
                  <p className="text-lg font-bold text-white">{nextModule.label}</p>
                  <p className="text-sm text-blue-200 mt-0.5">
                    {visitedCount === 0
                      ? "Commence par ici pour poser de solides bases en SAP FI."
                      : `Continue ton parcours — ${totalModules - visitedCount} module${totalModules - visitedCount > 1 ? "s" : ""} restant${totalModules - visitedCount > 1 ? "s" : ""}.`
                    }
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white/30 transition-colors">
                  <ArrowRight />
                </div>
              </Link>
            </motion.div>
          )}

          {percentage === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-5 text-center"
            >
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
                <CheckIcon /> Félicitations — tous les modules ont été explorés !
              </p>
              <Link to="/certifications" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                Prépare ta certification FI <ArrowRight />
              </Link>
            </motion.div>
          )}

          {/* ── Grille modules ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Modules SAP</h2>
              <Link to="/modules-sap" className="text-xs text-sapBlue dark:text-sapAccent hover:underline font-medium">
                Voir tout
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAP_MODULES.map((mod) => {
                const visited = isVisited(mod.slug);
                return (
                  <Link
                    key={mod.slug}
                    to={mod.path}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200
                                hover:shadow-sm group
                                ${visited
                                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/50"
                                  : "border-gray-100 dark:border-slate-700 hover:border-sapBlue/30 dark:hover:border-sapBlue/30"
                                }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                                    ${visited
                                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                      : "bg-gray-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                    }`}>
                      {visited ? <CheckIcon /> : mod.slug.toUpperCase()}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${
                      visited ? "text-emerald-700 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {mod.label}
                    </span>
                    <span className={`text-xs flex-shrink-0 transition-all
                                     ${visited
                                       ? "text-emerald-500 dark:text-emerald-400 font-medium"
                                       : "text-slate-300 group-hover:text-sapBlue dark:group-hover:text-sapAccent"
                                     }`}>
                      {visited ? "Visité" : <ArrowRight />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* ── Liens rapides ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Explorer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map(({ to, label, color }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium
                              transition-all hover:shadow-md hover:-translate-y-0.5 ${color}`}
                >
                  {label}
                  <ExternalLink />
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default DashboardPage;
