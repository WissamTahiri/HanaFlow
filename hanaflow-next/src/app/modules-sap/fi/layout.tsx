import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: "Module SAP FI — Finance",
  description:
    "Apprends SAP Finance (FI) : comptabilité générale, fournisseurs, clients et immobilisations. Prépare la certification C_TS4FI_2023.",
  openGraph: {
    title: "Module SAP FI — Finance | HanaFlow",
    description:
      "Apprends SAP Finance (FI) : comptabilité générale, fournisseurs, clients et immobilisations. Prépare la certification C_TS4FI_2023.",
    url: "/modules-sap/fi",
  },
};

export default function FiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP FI — Finance",
        "description": "Apprends SAP Finance (FI) : comptabilité générale, fournisseurs, clients et immobilisations. Prépare la certification C_TS4FI_2023.",
        "url": `${BASE}/modules-sap/fi`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Beginner to Intermediate",
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
