import type { Metadata } from "next";

/**
 * Layout du module HCM (retiré). La page page.tsx redirige vers /modules-sap/ai.
 * On garde un layout minimal sans metadata SEO indexable pour ne pas garder
 * d'ancienne URL HCM dans les SERPs Google.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HcmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
