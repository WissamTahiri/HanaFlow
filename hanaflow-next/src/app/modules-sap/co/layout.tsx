import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { certCode } from "@/lib/certCodes";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

// Code certif officiel — source de vérité cert-catalog.json (sap-cert-watch).
const CERT_CODE = certCode("co");

export const metadata: Metadata = {
  title: "Module SAP CO — Controlling",
  description:
    `Maîtrise SAP Controlling (CO) : centres de coûts, ordres internes, contrôle de gestion. Prépare la certification ${CERT_CODE}.`,
  openGraph: {
    title: "Module SAP CO — Controlling | HanaFlow",
    description:
      `Maîtrise SAP Controlling (CO) : centres de coûts, ordres internes, contrôle de gestion. Prépare la certification ${CERT_CODE}.`,
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
        "description": `Maîtrise SAP Controlling (CO) : centres de coûts, ordres internes, contrôle de gestion. Prépare la certification ${CERT_CODE}.`,
        "url": `${BASE}/modules-sap/co`,
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
