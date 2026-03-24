import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    console.log("Dark mode enabled ?", enabled);
    if (enabled) {
      root.classList.add("dark");
      root.style.backgroundColor = "#020617"; // slate-950
      root.style.color = "#f9fafb"; // slate-50
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "#ffffff";
      root.style.color = "#020617";
    }
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled((prev) => !prev)}
      className="inline-flex items-center gap-2 rounded-full border border-sapBlue/40 px-3 py-1 text-xs font-medium text-sapBlue dark:text-sapGrayLight bg-white/80 dark:bg-slate-900/80 shadow-soft hover:bg-sapBlue hover:text-white transition-colors"
      aria-label="Basculer le mode sombre"
    >
      <span>{enabled ? "Dark" : "Light"}</span>
      <span className="text-lg">{enabled ? "🌙" : "☀️"}</span>
    </button>
  );
};

export default DarkModeToggle;
