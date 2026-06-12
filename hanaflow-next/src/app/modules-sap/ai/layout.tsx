import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { certCode } from "@/lib/certCodes";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

// Code certif officiel — source de vérité cert-catalog.json (sap-cert-watch).
const CERT_CODE = certCode("ai");

export const metadata: Metadata = {
  title: "Module SAP IA — Generative AI & Joule",
  description:
    `Apprends SAP AI Core, AI Launchpad, Joule, RAG, prompt engineering et Responsible AI. Prépare la certification ${CERT_CODE} (Generative AI Developer).`,
  openGraph: {
    title: "Module SAP IA — Generative AI & Joule | HanaFlow",
    description:
      `Apprends SAP AI Core, AI Launchpad, Joule, RAG, prompt engineering. Prépare la certification ${CERT_CODE}.`,
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
        "description": `Apprends SAP AI Core, AI Launchpad, Joule, RAG, prompt engineering. Prépare la certification ${CERT_CODE}.`,
        "url": `${BASE}/modules-sap/ai`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Intermediate",
        "courseCode": CERT_CODE,
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
