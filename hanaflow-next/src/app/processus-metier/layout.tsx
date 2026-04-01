import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processus Métier SAP",
  description:
    "Comprends les processus métier SAP : Order-to-Cash, Procure-to-Pay, Record-to-Report et plus. La logique fonctionnelle derrière les modules SAP.",
  openGraph: {
    title: "Processus Métier SAP | HanaFlow",
    description:
      "Comprends les processus métier SAP : Order-to-Cash, Procure-to-Pay, Record-to-Report et plus.",
    url: "/processus-metier",
  },
};

export default function ProcessusMetierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
