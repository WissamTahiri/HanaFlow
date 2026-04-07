import { useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useProgress, SAP_MODULES } from "../hooks/useProgress";
import { useSubscription } from "../context/SubscriptionContext";
import { useGamification, BADGES, getLevelInfo } from "../context/GamificationContext";
import SEO from "../components/SEO";

/* ─── Icônes ──────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const MODULE_ACCENT = { fi: "#3B82F6", co: "#8B5CF6", mm: "#10B981", sd: "#F59E0B", hcm: "#EC4899", pp: "#EF4444" };
const RECOMMENDED_ORDER = ["fi", "mm", "sd", "co", "hcm", "pp"];
const FI_TOTAL_LESSONS  = 14;

const quickLinks = [
  { to: "/s4hana",           label: "S/4HANA",    color: "#3B82F6" },
  { to: "/ai-joule",         label: "AI Joule",   color: "#8B5CF6" },
  { to: "/processus-metier", label: "Processus",  color: "#10B981" },
  { to: "/roadmap",          label: "Roadmap",    color: "#F59E0B" },
];

export default function DashboardPage() {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const { isVisited, visitedCount, totalModules, percentage, loading, progress } = useProgress();
  const { isPro }         = useSubscription();
  const { xp, earnedBadges, onLogin } = useGamification();

  useEffect(() => { onLogin(); }, []); // eslint-disable-line

  const levelInfo = getLevelInfo(xp);

  const recentBadges = useMemo(
    () => earnedBadges.slice(-4).reverse().map((id) => BADGES.find((b) => b.id === id)).filter(Boolean),
    [earnedBadges]
  );

  const fiLessonsCompleted = useMemo(() => {
    try { const s = JSON.parse(localStorage.getItem("hanaflow_fi_lessons") || "[]"); return Array.isArray(s) ? s.length : 0; }
    catch { return 0; }
  }, []);

  const nextSlug   = useMemo(() => RECOMMENDED_ORDER.find((s) => !isVisited(s)), [progress]); // eslint-disable-line
  const nextModule = nextSlug ? SAP_MODULES.find((m) => m.slug === nextSlug) : null;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <>
      <SEO title="Dashboard" description="Votre espace personnel HanaFlow." path="/dashboard" />

      {/* ── Hero dark — header utilisateur ─────────────────── */}
      <div className="grain bg-slate-950 pt-8 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[400px] h-[200px] rounded-full bg-sapBlue/15 blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sapBlue to-sapBlueDark
                              flex items-center justify-center text-white font-bold text-lg shadow-soft flex-shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white tracking-display">
                  Bonjour, {user?.name} 👋
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sapBlue/20 text-sapAccent">
                    {user?.role === "student" ? "Étudiant SAP" : user?.role}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                    ${isPro ? "bg-amber-500/20 text-amber-400" : "bg-white/8 text-slate-500"}`}>
                    {isPro ? "⭐ Pro" : "Free"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/profil"
                className="px-4 py-2 text-sm font-medium text-slate-300 border border-white/12
                           rounded-xl hover:bg-white/8 transition-colors">
                Mon profil
              </Link>
              <button onClick={async () => { await logout(); navigate("/login"); }}
                className="px-4 py-2 text-sm font-medium text-red-400 border border-red-500/20
                           rounded-xl hover:bg-red-500/10 transition-colors">
                Déconnexion
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { label: "Modules", value: loading ? "—" : `${visitedCount} / ${totalModules}`, sub: `${percentage}% complété`, color: "#3B82F6" },
              { label: "Niveau",  value: `Niv. ${levelInfo.current.level}`, sub: levelInfo.current.name, color: "#F59E0B" },
              { label: "Plan",    value: isPro ? "Pro" : "Gratuit", sub: isPro ? "Accès complet" : "Chapitre 1 débloqué", color: isPro ? "#F59E0B" : "#64748B" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">{label}</p>
                <p className="font-display text-xl font-bold text-white" style={{ color }}>{value}</p>
                <p className="text-xs text-slate-600 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu principal — remonté sur le hero ─────────── */}
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen px-4 sm:px-6 -mt-10">
        <div className="max-w-4xl mx-auto space-y-5 pb-16">

          {/* ── Prochaine étape ───────────────────────────────── */}
          {nextModule && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Link to={nextModule.path}
                className="flex items-center justify-between gap-4 rounded-2xl p-5 shadow-sm
                           group hover:-translate-y-0.5 transition-all duration-200"
                style={{ background: `linear-gradient(135deg, ${MODULE_ACCENT[nextModule.slug]}22, ${MODULE_ACCENT[nextModule.slug]}08)`,
                         borderWidth: 1, borderStyle: "solid", borderColor: `${MODULE_ACCENT[nextModule.slug]}30` }}>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: MODULE_ACCENT[nextModule.slug] }}>
                    Prochaine étape recommandée
                  </p>
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight-xl">
                    {nextModule.label}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {visitedCount === 0 ? "Commence par ici pour poser de solides bases SAP."
                      : `Continue — ${totalModules - visitedCount} module${totalModules - visitedCount > 1 ? "s" : ""} restant.`}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                text-white group-hover:scale-110 transition-transform"
                  style={{ background: MODULE_ACCENT[nextModule.slug] }}>
                  <ArrowRight />
                </div>
              </Link>
            </motion.div>
          )}

          {percentage === 100 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-5 text-center">
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-center gap-2">
                <CheckIcon /> Félicitations — tous les modules ont été explorés !
              </p>
              <Link to="/certifications" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                Prépare ta certification FI <ArrowRight />
              </Link>
            </div>
          )}

          {/* ── XP + Badges ───────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* XP */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Niveau & XP</span>
                <span className="text-xs font-bold text-amber-500">{xp.toLocaleString()} XP</span>
              </div>
              <p className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight-xl">
                Niv. {levelInfo.current.level} — {levelInfo.current.name}
              </p>
              <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {levelInfo.next ? `${levelInfo.xpToNext} XP pour ${levelInfo.next.name}` : "Niveau maximum !"}
              </p>
            </div>

            {/* Badges */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Badges récents</span>
                <Link to="/achievements" className="text-xs text-sapBlue dark:text-sapAccent hover:underline font-medium">
                  Voir tout
                </Link>
              </div>
              {recentBadges.length > 0 ? (
                <div className="flex gap-3 flex-wrap">
                  {recentBadges.map((badge) => (
                    <div key={badge.id} className="flex flex-col items-center gap-1.5">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500
                                      flex items-center justify-center text-xl shadow-sm">
                        {badge.icon}
                      </div>
                      <p className="text-[9px] text-center text-slate-500 dark:text-slate-400 leading-tight max-w-[52px]">
                        {badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">Aucun badge — commence à explorer !</p>
              )}
              <p className="text-xs text-slate-400 mt-3">{earnedBadges.length} / {BADGES.length} débloqués</p>
            </div>
          </motion.div>

          {/* ── Certif FI + Plan ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Certif FI */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Certification FI</p>
              {fiLessonsCompleted > 0 ? (
                <>
                  <p className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight-xl">
                    {fiLessonsCompleted}
                    <span className="text-base font-normal text-slate-400 ml-1">/ {FI_TOTAL_LESSONS} leçons</span>
                  </p>
                  <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }}
                      animate={{ width: `${Math.round((fiLessonsCompleted / FI_TOTAL_LESSONS) * 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Non débuté</p>
                  <Link to="/certifications/fi"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sapBlue dark:text-sapAccent hover:underline">
                    Commencer <ArrowRight />
                  </Link>
                </>
              )}
            </div>

            {/* Plan */}
            <div className={`rounded-2xl border p-5 ${isPro
              ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/10 dark:to-orange-900/10 dark:border-amber-700/30"
              : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700"}`}>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Ton plan</p>
              <p className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight-xl">
                {isPro ? "⭐ Pro" : "Gratuit"}
              </p>
              {isPro
                ? <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">Accès complet à toutes les certifications</p>
                : <button onClick={() => navigate("/pricing")}
                    className="mt-3 text-xs font-semibold text-sapBlue dark:text-sapAccent hover:underline inline-flex items-center gap-1">
                    Passer à Pro <ArrowRight />
                  </button>
              }
            </div>
          </motion.div>

          {/* ── Modules SAP ───────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white tracking-tight-xl">Modules SAP</h2>
              <Link to="/modules-sap" className="text-xs text-sapBlue dark:text-sapAccent hover:underline font-medium">Voir tout</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAP_MODULES.map((mod) => {
                const visited = isVisited(mod.slug);
                const accent  = MODULE_ACCENT[mod.slug];
                return (
                  <Link key={mod.slug} to={mod.path}
                    className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 hover:shadow-sm group"
                    style={{
                      borderColor: visited ? `${accent}40` : undefined,
                      background:  visited ? `${accent}08` : undefined,
                    }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold"
                      style={{ background: `${accent}18`, color: accent }}>
                      {visited ? <CheckIcon /> : mod.slug.toUpperCase()}
                    </div>
                    <span className={`text-sm font-medium flex-1 ${visited ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"}`}>
                      {mod.label}
                    </span>
                    <span className="text-xs flex-shrink-0" style={{ color: visited ? accent : undefined }}>
                      {visited ? "✓" : <ArrowRight />}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* ── Explorer ──────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4 tracking-tight-xl">Explorer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map(({ to, label, color }) => (
                <Link key={to} to={to}
                  className="flex items-center justify-center py-3 px-3 rounded-xl text-sm font-medium
                             transition-all hover:-translate-y-0.5 hover:shadow-md border"
                  style={{ background: `${color}10`, borderColor: `${color}20`, color }}>
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}
