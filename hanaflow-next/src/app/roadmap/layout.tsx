import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap Consultant SAP",
  description:
    "Le chemin complet pour devenir consultant SAP junior. De débutant à certifié, étape par étape : formations, modules à maîtriser, certifications et premières missions.",
  openGraph: {
    title: "Roadmap Consultant SAP | HanaFlow",
    description:
      "Le chemin complet pour devenir consultant SAP junior. De débutant à certifié, étape par étape.",
    url: "/roadmap",
  },
};

export default function RoadmapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
