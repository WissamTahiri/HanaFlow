import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAP AI Joule",
  description:
    "Découvre Joule, l'assistant IA de SAP. Comment l'intelligence artificielle transforme les ERP et simplifie le travail des utilisateurs SAP.",
  openGraph: {
    title: "SAP AI Joule | HanaFlow",
    description:
      "Découvre Joule, l'assistant IA générative de SAP : cas d'usage par module (FI, MM, SD), architecture AI Core, RAG et impact sur le métier de consultant S/4HANA.",
    url: "/ai-joule",
  },
};

export default function AiJouleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
