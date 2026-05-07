"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGamification } from "@/context/GamificationContext";

export default function BadgeToast() {
  const { notification, dismissNotification } = useGamification();

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(dismissNotification, 4000);
    return () => clearTimeout(t);
  }, [notification, dismissNotification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl px-4 py-3 max-w-xs cursor-pointer"
          onClick={dismissNotification}
        >
          <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-500 text-2xl flex-shrink-0">
            {notification.badge.icon}
          </div>
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Badge débloqué !</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{notification.badge.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">+{notification.badge.xp} XP</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
