import type { Metadata } from "next";

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
  return <>{children}</>;
}
