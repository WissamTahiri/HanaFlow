import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "HanaFlow est une plateforme éducative dédiée à l'apprentissage de SAP. Notre mission : rendre SAP accessible à tous, des étudiants aux futurs consultants.",
  openGraph: {
    title: "À propos | HanaFlow",
    description:
      "HanaFlow est une plateforme éducative dédiée à l'apprentissage de SAP. Notre mission : rendre SAP accessible à tous.",
    url: "/a-propos",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
