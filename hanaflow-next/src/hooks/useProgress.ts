"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

export const SAP_MODULES = [
  { slug: "fi",  label: "FI — Finance",             path: "/modules-sap/fi",  color: "bg-blue-500"   },
  { slug: "co",  label: "CO — Controlling",          path: "/modules-sap/co",  color: "bg-purple-500" },
  { slug: "mm",  label: "MM — Gestion des stocks",   path: "/modules-sap/mm",  color: "bg-green-500"  },
  { slug: "sd",  label: "SD — Ventes",               path: "/modules-sap/sd",  color: "bg-amber-500" },
  { slug: "hcm", label: "HCM — Ressources humaines", path: "/modules-sap/hcm", color: "bg-pink-500"   },
  { slug: "pp",  label: "PP — Production",           path: "/modules-sap/pp",  color: "bg-teal-500"   },
];

export const useProgress = () => {
  const { token, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress.map((p: { module: string }) => p.module));
      }
    } catch { /* silencieux si offline */ }
    finally { setLoading(false); }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const markVisited = useCallback(async (moduleSlug: string) => {
    if (!isAuthenticated || !token) return;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ module: moduleSlug }),
      });
      setProgress((prev) =>
        prev.includes(moduleSlug) ? prev : [...prev, moduleSlug]
      );
    } catch { /* silencieux */ }
  }, [isAuthenticated, token]);

  const isVisited = (slug: string) => progress.includes(slug);
  const visitedCount = progress.length;
  const totalModules = SAP_MODULES.length;
  const percentage = Math.round((visitedCount / totalModules) * 100);

  return { progress, loading, markVisited, isVisited, visitedCount, totalModules, percentage };
};
