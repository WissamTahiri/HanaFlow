import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Liste des modules SAP avec leurs métadonnées
export const SAP_MODULES = [
  { slug: "fi",  label: "FI — Finance",             path: "/modules-sap/fi",  color: "bg-blue-500"   },
  { slug: "co",  label: "CO — Controlling",          path: "/modules-sap/co",  color: "bg-purple-500" },
  { slug: "mm",  label: "MM — Gestion des stocks",   path: "/modules-sap/mm",  color: "bg-green-500"  },
  { slug: "sd",  label: "SD — Ventes",               path: "/modules-sap/sd",  color: "bg-orange-500" },
  { slug: "hcm", label: "HCM — Ressources humaines", path: "/modules-sap/hcm", color: "bg-pink-500"   },
  { slug: "pp",  label: "PP — Production",           path: "/modules-sap/pp",  color: "bg-teal-500"   },
];

export const useProgress = () => {
  const { token, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState([]); // liste des modules visités
  const [loading, setLoading] = useState(false);

  // Charge la progression depuis l'API
  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress.map((p) => p.module));
      }
    } catch { /* silencieux si offline */ }
    finally { setLoading(false); }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Marque un module comme visité
  const markVisited = useCallback(async (moduleSlug) => {
    if (!isAuthenticated || !token) return;
    try {
      await fetch(`${API_URL}/progress/${moduleSlug}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      setProgress((prev) =>
        prev.includes(moduleSlug) ? prev : [...prev, moduleSlug]
      );
    } catch { /* silencieux */ }
  }, [isAuthenticated, token]);

  const isVisited = (slug) => progress.includes(slug);
  const visitedCount = progress.length;
  const totalModules = SAP_MODULES.length;
  const percentage = Math.round((visitedCount / totalModules) * 100);

  return { progress, loading, markVisited, isVisited, visitedCount, totalModules, percentage };
};
