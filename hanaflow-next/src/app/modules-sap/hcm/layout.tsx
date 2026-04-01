import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: "Module SAP HCM — Human Capital Management",
  description:
    "Apprends SAP HCM : gestion des ressources humaines, paie, gestion du temps et recrutement. Prépare la certification C_THR81_2311.",
  openGraph: {
    title: "Module SAP HCM — Human Capital Management | HanaFlow",
    description:
      "Apprends SAP HCM : gestion des ressources humaines, paie, gestion du temps et recrutement. Prépare la certification C_THR81_2311.",
    url: "/modules-sap/hcm",
  },
};

export default function HcmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP HCM — Human Capital Management",
        "description": "Apprends SAP HCM : gestion des ressources humaines, paie, gestion du temps et recrutement. Prépare la certification C_THR81_2311.",
        "url": `${BASE}/modules-sap/hcm`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Intermediate",
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
