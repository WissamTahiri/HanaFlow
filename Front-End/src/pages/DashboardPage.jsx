import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress, SAP_MODULES } from "../hooks/useProgress";
import SEO from "../components/SEO";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isVisited, visitedCount, totalModules, percentage, loading } = useProgress();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <SEO title="Dashboard" description="Votre espace personnel HanaFlow — suivez votre progression SAP." path="/dashboard" />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* En-tête */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Bonjour, {user?.name} 👋
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                <span className="inline-block mt-2 text-xs font-medium bg-sapBlue/10 text-sapBlue px-2.5 py-1 rounded-full">
                  {user?.role === "student" ? "Étudiant SAP" : user?.role}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/profil"
                  className="px-4 py-2 text-sm border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Progression globale */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Progression SAP
              </h2>
              <span className="text-2xl font-bold text-sapBlue">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 mb-2">
              <div
                className="bg-sapBlue h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? "Chargement..." : `${visitedCount} module${visitedCount > 1 ? "s" : ""} visité${visitedCount > 1 ? "s" : ""} sur ${totalModules}`}
            </p>
          </div>

          {/* Grille des modules */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Modules SAP
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAP_MODULES.map((mod) => {
                const visited = isVisited(mod.slug);
                return (
                  <Link
                    key={mod.slug}
                    to={mod.path}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md ${
                      visited
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800"
                        : "border-gray-100 dark:border-slate-700 hover:border-sapBlue/30"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${visited ? "bg-green-500" : "bg-gray-300 dark:bg-slate-500"}`} />
                    <span className={`text-sm font-medium ${visited ? "text-green-700 dark:text-green-400" : "text-slate-700 dark:text-gray-300"}`}>
                      {mod.label}
                    </span>
                    {visited && (
                      <span className="ml-auto text-xs text-green-600 dark:text-green-400">✓ Visité</span>
                    )}
                    {!visited && (
                      <span className="ml-auto text-xs text-gray-400">→</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Liens rapides */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Explorer
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                { to: "/s4hana",           label: "S/4HANA" },
                { to: "/ai-joule",         label: "SAP AI Joule" },
                { to: "/processus-metier", label: "Processus métier" },
                { to: "/roadmap",          label: "Ma Roadmap" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 text-sm bg-sapBlue/5 text-sapBlue rounded-lg hover:bg-sapBlue/10 transition-colors font-medium"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default DashboardPage;
