import type { Metadata } from "next";

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
  return <>{children}</>;
}
