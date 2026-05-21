import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications SAP",
  description:
    "Prépare tes certifications SAP avec nos simulateurs d'examens : FI, CO, MM, SD, PP, IA générative (C_AIG). Corrections détaillées et certificats PDF à télécharger.",
  openGraph: {
    title: "Certifications SAP | HanaFlow",
    description:
      "Prépare tes certifications SAP avec nos simulateurs d'examens : FI, CO, MM, SD, PP, IA générative (C_AIG). Corrections détaillées et certificats PDF à télécharger.",
    url: "/certifications",
  },
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
