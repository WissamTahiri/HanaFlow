"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export default function MaintenanceGate({
  enabled,
  message,
  children,
}: {
  enabled: boolean;
  message: string;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();

  // Toujours laisser passer les admins (qui doivent pouvoir bosser)
  if (!enabled || loading || user?.role === "admin") return <>{children}</>;

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Site en maintenance
        </h1>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
        <p className="text-xs text-slate-400 mt-6">
          Si vous êtes administrateur, connectez-vous pour accéder normalement au site.
        </p>
      </div>
    </div>
  );
}
