import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: "Module SAP IA — Generative AI & Joule",
  description:
    "Apprends SAP AI Core, AI Launchpad, Joule, RAG, prompt engineering et Responsible AI. Prépare la certification C_AIG_2404 (Generative AI Developer).",
  openGraph: {
    title: "Module SAP IA — Generative AI & Joule | HanaFlow",
    description:
      "Apprends SAP AI Core, AI Launchpad, Joule, RAG, prompt engineering. Prépare la certification C_AIG_2404.",
    url: "/modules-sap/ai",
  },
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP IA — Generative AI & Joule",
        "description": "Apprends SAP AI Core, AI Launchpad, Joule, RAG, prompt engineering. Prépare la certification C_AIG_2404.",
        "url": `${BASE}/modules-sap/ai`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Intermediate",
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
