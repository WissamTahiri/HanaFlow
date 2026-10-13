import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV Builder IA — CV consultant SAP optimisé ATS",
  description:
    "Génère ton CV de consultant SAP optimisé ATS avec notre IA : score de compatibilité, conseils ciblés et export PDF, en quelques minutes.",
  openGraph: {
    title: "CV Builder IA — CV consultant SAP optimisé ATS | HanaFlow",
    description:
      "Génère ton CV de consultant SAP optimisé ATS avec notre IA : score de compatibilité, conseils ciblés et export PDF, en quelques minutes.",
    url: "/cv-builder",
  },
};

export default function CvBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
