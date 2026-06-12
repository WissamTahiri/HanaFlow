import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { certCode } from "@/lib/certCodes";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

// Code certif officiel — source de vérité cert-catalog.json (sap-cert-watch).
const CERT_CODE = certCode("sd");

export const metadata: Metadata = {
  title: "Module SAP SD — Sales & Distribution",
  description:
    `Maîtrise SAP Sales & Distribution (SD) : commandes clients, livraisons, facturation et tarification. Prépare la certification ${CERT_CODE}.`,
  openGraph: {
    title: "Module SAP SD — Sales & Distribution | HanaFlow",
    description:
      `Maîtrise SAP Sales & Distribution (SD) : commandes clients, livraisons, facturation et tarification. Prépare la certification ${CERT_CODE}.`,
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
        "description": `Maîtrise SAP SD : commandes clients, livraisons, facturation et tarification. Prépare la certification ${CERT_CODE}.`,
        "url": `${BASE}/modules-sap/sd`,
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
