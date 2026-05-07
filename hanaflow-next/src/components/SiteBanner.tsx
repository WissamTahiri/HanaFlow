"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DISMISSED_KEY = "hf_banner_dismissed";

export default function SiteBanner({
  enabled,
  message,
  link,
}: {
  enabled: boolean;
  message: string;
  link: string;
}) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(DISMISSED_KEY);
    setDismissed(stored === message); // dismiss only matches if message hasn't changed
  }, [message]);

  if (!enabled || !message || dismissed) return null;

  const close = () => {
    localStorage.setItem(DISMISSED_KEY, message);
    setDismissed(true);
  };

  const Inner = (
    <span className="font-medium">{message}</span>
  );

  return (
    <div className="bg-linear-to-r from-sap-blue-dark to-sap-blue text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {link ? (
            <Link href={link} className="hover:underline truncate">
              {Inner}
            </Link>
          ) : (
            <span className="truncate">{Inner}</span>
          )}
        </div>
        <button
          onClick={close}
          aria-label="Fermer la bannière"
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-white/15 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
