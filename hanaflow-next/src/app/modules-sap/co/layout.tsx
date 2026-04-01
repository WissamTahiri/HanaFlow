import type { Metadata } from "next";

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
  return <>{children}</>;
}
