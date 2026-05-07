"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useGamification, BADGES, LEVELS, getLevelInfo } from "@/context/GamificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const CATEGORIES = ["Démarrage", "Certifications", "Quiz", "Examens", "Régularité", "Abonnement"];

function AchievementsContent() {
  const { xp, earnedBadges, levelInfo, streak } = useGamification();
  const { current, next, progress, xpToNext } = levelInfo;

  const totalBadges = BADGES.length;
  const unlockedCount = earnedBadges.length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-sap-dark">
      {/* Hero */}
      <div className="bg-linear-to-br from-slate-900 via-amber-900 to-amber-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <span>/</span>
            <span className="text-white/90">Achievements</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Vos Achievements</h1>
              <p className="text-white/70">{unlockedCount}/{totalBadges} badges débloqués · {xp.toLocaleString()} XP total</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 min-w-[240px] border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Niveau {current.level}</span>
                {streak > 0 && (
                  <span className="text-xs bg-amber-500/30 text-amber-200 border border-amber-400/30 px-2 py-0.5 rounded-full font-semibold">
                    🔥 {streak} jours
                  </span>
                )}
              </div>
              <p className="text-xl font-extrabold text-white mb-3">{current.name}</p>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-linear-to-r from-amber-400 to-amber-400 rounded-full"
                />
              </div>
              <p className="text-xs text-white/60">
                {next ? `${xpToNext} XP pour atteindre ${next.name} (Niv. ${next.level})` : "Niveau maximum atteint !"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Barre de progression globale */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900 dark:text-white">Progression globale</h2>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{unlockedCount}/{totalBadges} badges</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${(unlockedCount / totalBadges) * 100}%` }} transition={{ duration: 1 }}
              className="h-full bg-linear-to-r from-amber-400 to-amber-500 rounded-full"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "XP total",  value: xp.toLocaleString(),                                     color: "text-amber-600 dark:text-amber-400" },
              { label: "Niveau",    value: current.name,                                             color: "text-purple-600 dark:text-purple-400" },
              { label: "Badges",    value: `${unlockedCount}/${totalBadges}`,                        color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Série",     value: streak > 0 ? `🔥 ${streak} jours` : "—",                color: "text-amber-600 dark:text-amber-400" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badges par catégorie */}
        {CATEGORIES.map((cat, catIdx) => {
          const catBadges = BADGES.filter((b) => b.category === cat);
          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: catIdx * 0.06 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-bold text-slate-900 dark:text-white">{cat}</h2>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {catBadges.filter((b) => earnedBadges.includes(b.id)).length}/{catBadges.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {catBadges.map((badge) => {
                  const unlocked = earnedBadges.includes(badge.id);
                  return (
                    <div key={badge.id} className={`bg-white dark:bg-slate-800 rounded-2xl border p-4 text-center transition-all
                      ${unlocked ? "border-amber-200 dark:border-amber-800/50 shadow-sm" : "border-gray-200 dark:border-slate-700 opacity-50 grayscale"}`}>
                      <div className={`text-3xl mb-2 ${unlocked ? "" : "opacity-40"}`}>{badge.icon}</div>
                      <p className={`text-xs font-bold mb-0.5 ${unlocked ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>{badge.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mb-2">{badge.desc}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${unlocked ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-100 dark:bg-slate-700 text-slate-400"}`}>
                        +{badge.xp} XP
                      </span>
                      {unlocked && <p className="text-xs text-emerald-500 font-semibold mt-1.5">✓ Débloqué</p>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Niveaux */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6"
        >
          <h2 className="font-bold text-slate-900 dark:text-white mb-4">Niveaux</h2>
          <div className="space-y-2">
            {LEVELS.map((lvl) => {
              const isCurrentLevel = lvl.level === current.level;
              const isReached = xp >= lvl.minXP;
              return (
                <div key={lvl.level} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors
                  ${isCurrentLevel ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800" : ""}`}>
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${isReached ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-slate-400"}`}>
                    {lvl.level}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isCurrentLevel ? "text-amber-700 dark:text-amber-400" : isReached ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                      {lvl.name}
                      {isCurrentLevel && <span className="ml-2 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">Actuel</span>}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{lvl.minXP.toLocaleString()} XP</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  return (
    <ProtectedRoute>
      <AchievementsContent />
    </ProtectedRoute>
  );
}
