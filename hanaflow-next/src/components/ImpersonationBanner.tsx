"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ImpersonationBanner() {
  const { isImpersonating, impersonatedBy, user, stopImpersonation } = useAuth();
  const router = useRouter();

  if (!isImpersonating || !impersonatedBy || !user) return null;

  const handleStop = async () => {
    await stopImpersonation();
    router.push("/admin");
  };

  return (
    <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="truncate">
            <span className="font-bold">Mode impersonation actif</span>
            <span className="hidden sm:inline"> — vous voyez le site comme </span>
            <span className="sm:hidden"> · </span>
            <span className="font-semibold">{user.name}</span>
            <span className="hidden md:inline"> ({user.email})</span>
            <span className="hidden lg:inline"> · admin : {impersonatedBy.email}</span>
          </p>
        </div>
        <button
          onClick={handleStop}
          className="flex-shrink-0 px-3 py-1 rounded-lg bg-amber-950 text-amber-50 text-xs font-bold hover:bg-amber-900 transition-colors whitespace-nowrap"
        >
          Quitter →
        </button>
      </div>
    </div>
  );
}
