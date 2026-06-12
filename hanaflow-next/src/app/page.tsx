import type { Metadata } from "next";
import Home from "./_home";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: {
    absolute: "HanaFlow",
  },
  description:
    "Cours SAP FI, CO, MM, SD, PP, IA générative (Joule, RAG) et S/4HANA. Simulateurs d'examens, certifications et roadmap consultant. Commence gratuitement.",
  openGraph: {
    title: "HanaFlow — Apprends SAP de zéro à consultant certifié",
    description:
      "Cours SAP FI, CO, MM, SD, PP, IA générative et S/4HANA. Simulateurs d'examens, certifications et roadmap consultant.",
    url: "/",
  },
};

// Seuil en dessous duquel on n'affiche PAS le compteur d'inscrits :
// « 12 inscrits » dessert plus qu'il ne rassure. En dessous, la stats bar
// garde « 100 % Gratuit ».
const USER_COUNT_DISPLAY_THRESHOLD = 20;

export default async function Page() {
  let userCount: number | null = null;
  try {
    const count = await prisma.user.count();
    if (count >= USER_COUNT_DISPLAY_THRESHOLD) userCount = count;
  } catch {
    // DB indisponible → on rend la home sans le compteur.
  }
  return <Home userCount={userCount} />;
}
