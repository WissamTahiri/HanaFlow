import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGamification, BADGES, LEVELS } from "../context/GamificationContext.jsx";
import SEO from "../components/SEO.jsx";

const CATEGORIES = ["Démarrage", "Certifications", "Quiz", "Examens", "Régularité", "Abonnement"];

export default function AchievementsPage() {
  const { xp, earnedBadges, levelInfo, streak } = useGamification();
  const { current, next, progress, xpToNext } = levelInfo;
  const barRef     = useRef(null);
  const lvlBarRef  = useRef(null);
  const cardsRef   = useRef(null);

  const totalBadges   = BADGES.length;
  const unlockedCount = earnedBadges.length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar global
      gsap.from(barRef.current, { scaleX: 0, transformOrigin: "left", duration: 1, ease: "power3.out", delay: 0.2 });
      // XP bar niveau
      gsap.from(lvlBarRef.current, { scaleX: 0, transformOrigin: "left", duration: 1.2, ease: "power3.out", delay: 0.4 });
      // Cartes de badges
      gsap.from(".badge-card", { opacity: 0, y: 16, stagger: 0.04, duration: 0.4, ease: "power3.out", delay: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <SEO
        title="Achievements — HanaFlow"
        description="Vos badges et votre progression sur HanaFlow."
        path="/achievements"
      />

      {/* ── Hero dark ─────────────────────────────────── */}
      <div className="grain relative bg-slate-950 pt-20 pb-24 px-4 sm:px-6 overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[350px] rounded-full blur-[110px] opacity-15"
            style={{ background: "linear-gradient(135deg,#F59E0B,#EF4444)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-slate-600 mb-5">
            <Link to="/" className="hover:text-slate-400 transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/dashboard" className="hover:text-slate-400 transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-400">Achievements</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-3">Gamification</p>
              <h1 className="font-display text-5xl sm:text-6xl font-bold text-white tracking-display mb-3">
                Vos Achievements
              </h1>
              <p className="text-slate-400 text-sm">
                {unlockedCount}/{totalBadges} badges débloqués · {xp.toLocaleString()} XP total
              </p>
            </div>

            {/* Carte niveau */}
            <div className="shrink-0 w-full sm:w-64 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/8">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Niveau {current.level}</span>
                {streak > 0 && (
                  <span className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded-full font-semibold">
                    🔥 {streak} jours
                  </span>
                )}
              </div>
              <p className="font-display text-xl font-bold text-white mb-3">{current.name}</p>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div ref={lvlBarRef} className="h-full rounded-full"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#F59E0B,#EF4444)" }} />
              </div>
              <p className="text-xs text-slate-500">
                {next ? `${xpToNext} XP → ${next.name} (Niv. ${next.level})` : "Niveau maximum atteint !"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenu ───────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-slate-950 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto -mt-10 space-y-8">

          {/* Progression globale */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-slate-900 dark:text-white tracking-tight-xl">Progression globale</h2>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{unlockedCount}/{totalBadges} badges</span>
            </div>
            <div className="h-2.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div ref={barRef} className="h-full rounded-full"
                style={{ width: `${(unlockedCount / totalBadges) * 100}%`, background: "linear-gradient(90deg,#F59E0B,#EF4444)" }} />
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "XP total",  value: xp.toLocaleString(),                        color: "text-amber-600 dark:text-amber-400" },
                { label: "Niveau",    value: current.name,                               color: "text-purple-600 dark:text-purple-400" },
                { label: "Badges",    value: `${unlockedCount}/${totalBadges}`,           color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Série",     value: streak > 0 ? `🔥 ${streak} jours` : "—",   color: "text-orange-600 dark:text-orange-400" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 text-center">
                  <p className={`font-display text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Badges par catégorie */}
          <div ref={cardsRef}>
            {CATEGORIES.map((cat) => {
              const catBadges = BADGES.filter((b) => b.category === cat);
              return (
                <div key={cat} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="font-display font-semibold text-slate-900 dark:text-white tracking-tight-xl">{cat}</h2>
                    <span className="text-xs text-slate-400">
                      {catBadges.filter((b) => earnedBadges.includes(b.id)).length}/{catBadges.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {catBadges.map((badge) => {
                      const unlocked = earnedBadges.includes(badge.id);
                      return (
                        <div key={badge.id}
                          className={`badge-card bg-white dark:bg-slate-900 rounded-2xl border p-4 text-center transition-all ${
                            unlocked
                              ? "border-amber-200 dark:border-amber-800/50 shadow-sm"
                              : "border-gray-100 dark:border-slate-800 opacity-50 grayscale"
                          }`}>
                          <div className={`text-3xl mb-2 ${unlocked ? "" : "opacity-40"}`}>{badge.icon}</div>
                          <p className={`text-xs font-bold mb-0.5 ${unlocked ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                            {badge.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mb-2">{badge.desc}</p>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            unlocked ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 dark:bg-slate-800 text-slate-400"
                          }`}>
                            +{badge.xp} XP
                          </span>
                          {unlocked && <p className="text-xs text-emerald-500 font-semibold mt-1.5">✓ Débloqué</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Palette des niveaux */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6">
            <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-4 tracking-tight-xl">Niveaux</h2>
            <div className="space-y-2">
              {LEVELS.map((lvl) => {
                const isCurrentLevel = lvl.level === current.level;
                const isReached = xp >= lvl.minXP;
                return (
                  <div key={lvl.level}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                      isCurrentLevel ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800" : ""
                    }`}>
                    <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isReached ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-slate-800 text-slate-400"
                    }`}>
                      {lvl.level}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${
                        isCurrentLevel ? "text-amber-700 dark:text-amber-400" : isReached ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"
                      }`}>
                        {lvl.name}
                        {isCurrentLevel && (
                          <span className="ml-2 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Actuel</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{lvl.minXP.toLocaleString()} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
