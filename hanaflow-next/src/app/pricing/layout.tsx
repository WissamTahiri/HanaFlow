import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Plans HanaFlow : gratuit et Pro. Accède à tous les modules SAP, simulateurs d'examens et certifications avec le plan Pro.",
  openGraph: {
    title: "Tarifs | HanaFlow",
    description:
      "Plans HanaFlow : gratuit et Pro. Accède à tous les modules SAP, simulateurs d'examens et certifications.",
    url: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
