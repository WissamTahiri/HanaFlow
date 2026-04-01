import type { Metadata } from "next";

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
  return <>{children}</>;
}
