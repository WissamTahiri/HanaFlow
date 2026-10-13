import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entretien d'embauche SAP simulé par IA",
  description:
    "Entraîne-toi à l'entretien SAP avec un mock interview noté par IA : questions techniques et mises en situation par module, score et corrigé détaillé.",
  openGraph: {
    title: "Entretien d'embauche SAP simulé par IA | HanaFlow",
    description:
      "Entraîne-toi à l'entretien SAP avec un mock interview noté par IA : questions techniques et mises en situation par module, score et corrigé détaillé.",
    url: "/entretien",
  },
};

export default function EntretienLayout({ children }: { children: React.ReactNode }) {
  return children;
}
