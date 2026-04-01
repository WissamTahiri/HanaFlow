import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: "Module SAP PP — Production Planning",
  description:
    "Maîtrise SAP Production Planning (PP) : planification de la production, MRP et ordres de fabrication. Prépare la certification C_TS422_2023.",
  openGraph: {
    title: "Module SAP PP — Production Planning | HanaFlow",
    description:
      "Maîtrise SAP Production Planning (PP) : planification de la production, MRP et ordres de fabrication. Prépare la certification C_TS422_2023.",
    url: "/modules-sap/pp",
  },
};

export default function PpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP PP — Production Planning",
        "description": "Maîtrise SAP PP : planification de la production, MRP et ordres de fabrication. Prépare la certification C_TS422_2023.",
        "url": `${BASE}/modules-sap/pp`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Intermediate",
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
