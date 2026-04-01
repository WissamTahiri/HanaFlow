import type { Metadata } from "next";

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
  return <>{children}</>;
}
