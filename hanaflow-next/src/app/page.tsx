import type { Metadata } from "next";
import Home from "./_home";

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

export default function Page() {
  return <Home />;
}
