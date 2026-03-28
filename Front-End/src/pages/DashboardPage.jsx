import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress, SAP_MODULES } from "../hooks/useProgress";
import SEO from "../components/SEO";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ExternalLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const quickLinks = [
  { to: "/s4hana",           label: "S/4HANA",          color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  { to: "/ai-joule",         label: "SAP AI Joule",      color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
  { to: "/processus-metier", label: "Processus métier",  color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" },
  { to: "/roadmap",          label: "Ma Roadmap",        color: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isVisited, visitedCount, totalModules, percentage, loading } = useProgress();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <>
      <SEO title="Dashboard" description="Votre espace personnel HanaFlow — suivez votre progression SAP." path="/dashboard" />

      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sapDark py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header utilisateur */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sapBlue to-sapBlueDark
                                flex items-center justify-center text-white font-bold text-lg shadow-soft flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    Bonjour, {user?.name} 👋
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user?.email}</p>
                  <span className="badge-blue mt-2 inline-block">
                    {user?.role === "student" ? "Étudiant SAP" : user?.role}
                  </span>
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

          {/* Progression globale */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Progression SAP</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {loading ? "Chargement..." : `${visitedCount} module${visitedCount > 1 ? "s" : ""} sur ${totalModules} visité${visitedCount > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold gradient-text">{percentage}%</span>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-sapBlue to-sapAccent"
              />
            </div>

            {percentage === 100 && (
              <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckIcon /> Félicitations — tous les modules ont été explorés !
              </p>
            )}
          </motion.div>

          {/* Grille modules */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Modules SAP</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAP_MODULES.map((mod) => {
                const visited = isVisited(mod.slug);
                return (
                  <Link
                    key={mod.slug}
                    to={mod.path}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
                                hover:shadow-md group
                                ${visited
                                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/50"
                                  : "border-gray-100 dark:border-slate-700 hover:border-sapBlue/30 dark:hover:border-sapBlue/30"
                                }`}
                  >
                    {/* Indicateur */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold
                                    ${visited
                                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
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
                                       ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                       : "text-slate-400 group-hover:text-sapBlue dark:group-hover:text-sapAccent"
                                     }`}>
                      {visited ? "Visité" : <ArrowRight />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Liens rapides */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-card p-6"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Explorer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map(({ to, label, color }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium
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
