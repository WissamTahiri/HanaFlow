"use client";

import { useSyncExternalStore, useCallback } from "react";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const STORAGE_KEY = "hanaflow-theme";

// useSyncExternalStore : bridge propre vers le store externe (localStorage +
// matchMedia). Évite le pattern setState-in-effect que React 19 décourage.

function subscribe(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", callback);
  };
}

function getClientSnapshot(): "dark" | "light" {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): "dark" | "light" {
  // Server-side : pas d'info ; on défaut sur "light" (le ThemeScript dans <head>
  // applique la bonne classe avant le premier paint, donc pas de flash).
  return "light";
}

export default function DarkModeToggle() {
  const theme = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const dark = theme === "dark";

  const toggle = useCallback(() => {
    const next = dark ? "light" : "dark";
    if (next === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, next);
    // Re-déclenche subscribe() en simulant un storage event (même onglet)
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: next }));
  }, [dark]);

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200
                 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600
                 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700
                 hover:text-sap-blue dark:hover:text-sap-accent transition-all duration-150"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
