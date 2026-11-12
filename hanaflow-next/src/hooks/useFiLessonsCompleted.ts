import { useMemo } from "react";

/** Nombre de leçons FI marquées terminées côté client (localStorage, pas de source serveur pour ce compteur). */
export function useFiLessonsCompleted(): number {
  return useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("hanaflow_fi_lessons") || "[]");
      return Array.isArray(saved) ? saved.length : 0;
    } catch { return 0; }
  }, []);
}
