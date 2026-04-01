import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module SAP MM — Materials Management",
  description:
    "Apprends SAP Materials Management (MM) : achats, gestion des stocks et valorisation des articles. Prépare la certification C_TS452_2310.",
  openGraph: {
    title: "Module SAP MM — Materials Management | HanaFlow",
    description:
      "Apprends SAP Materials Management (MM) : achats, gestion des stocks et valorisation des articles. Prépare la certification C_TS452_2310.",
    url: "/modules-sap/mm",
  },
};

export default function MmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
