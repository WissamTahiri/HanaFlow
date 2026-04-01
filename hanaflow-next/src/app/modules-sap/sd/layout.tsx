import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

export const metadata: Metadata = {
  title: "Module SAP SD — Sales & Distribution",
  description:
    "Maîtrise SAP Sales & Distribution (SD) : commandes clients, livraisons, facturation et tarification. Prépare la certification C_TS460_2023.",
  openGraph: {
    title: "Module SAP SD — Sales & Distribution | HanaFlow",
    description:
      "Maîtrise SAP Sales & Distribution (SD) : commandes clients, livraisons, facturation et tarification. Prépare la certification C_TS460_2023.",
    url: "/modules-sap/sd",
  },
};

export default function SdLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP SD — Sales & Distribution",
        "description": "Maîtrise SAP SD : commandes clients, livraisons, facturation et tarification. Prépare la certification C_TS460_2023.",
        "url": `${BASE}/modules-sap/sd`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Intermediate",
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
