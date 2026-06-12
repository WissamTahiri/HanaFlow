import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { certCode } from "@/lib/certCodes";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://hanaflow.vercel.app";

// Code certif officiel — source de vérité cert-catalog.json (sap-cert-watch).
const CERT_CODE = certCode("mm");

export const metadata: Metadata = {
  title: "Module SAP MM — Materials Management",
  description:
    `Apprends SAP Materials Management (MM) : achats, gestion des stocks et valorisation des articles. Prépare la certification ${CERT_CODE}.`,
  openGraph: {
    title: "Module SAP MM — Materials Management | HanaFlow",
    description:
      `Apprends SAP Materials Management (MM) : achats, gestion des stocks et valorisation des articles. Prépare la certification ${CERT_CODE}.`,
    url: "/modules-sap/mm",
  },
};

export default function MmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Module SAP MM — Materials Management",
        "description": `Apprends SAP MM : achats, gestion des stocks et valorisation des articles. Prépare la certification ${CERT_CODE}.`,
        "url": `${BASE}/modules-sap/mm`,
        "provider": { "@type": "EducationalOrganization", "name": "HanaFlow", "url": BASE },
        "educationalLevel": "Beginner to Intermediate",
        "courseCode": CERT_CODE,
        "inLanguage": "fr",
        "isAccessibleForFree": true,
      }} />
      {children}
    </>
  );
}
