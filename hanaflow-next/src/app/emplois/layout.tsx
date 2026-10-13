import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres d'emploi SAP — Consultant FI, CO, MM, SD, PP",
  description:
    "Toutes les offres d'emploi et missions SAP du moment : consultant FI, CO, MM, SD, PP, junior à senior, remote ou sur site. Candidature en un clic avec ton CV IA.",
  openGraph: {
    title: "Offres d'emploi SAP — Consultant FI, CO, MM, SD, PP | HanaFlow",
    description:
      "Toutes les offres d'emploi et missions SAP du moment : consultant FI, CO, MM, SD, PP, junior à senior, remote ou sur site. Candidature en un clic avec ton CV IA.",
    url: "/emplois",
  },
};

export default function EmploisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
