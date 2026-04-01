import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAP S/4HANA",
  description:
    "Comprends SAP S/4HANA : architecture in-memory, différences avec ECC, migration et nouveautés. La prochaine génération d'ERP SAP expliquée simplement.",
  openGraph: {
    title: "SAP S/4HANA | HanaFlow",
    description:
      "Comprends SAP S/4HANA : architecture in-memory, différences avec ECC, migration et nouveautés.",
    url: "/s4hana",
  },
};

export default function S4HanaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
