import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: "Module SAP CO — Controlling",
  description:
    "Maîtrise SAP Controlling (CO) : centres de coûts, ordres internes, contrôle de gestion. Prépare la certification C_TS4CO_2023.",
  openGraph: {
    title: "Module SAP CO — Controlling | HanaFlow",
    description:
      "Maîtrise SAP Controlling (CO) : centres de coûts, ordres internes, contrôle de gestion. Prépare la certification C_TS4CO_2023.",
    url: "/modules-sap/co",
  },
};

export default function CoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP CO — Controlling",
        "description": "Maîtrise SAP Controlling (CO) : centres de coûts, ordres internes, contrôle de gestion. Prépare la certification C_TS4CO_2023.",
        "url": `${BASE}/modules-sap/co`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Intermediate",
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
