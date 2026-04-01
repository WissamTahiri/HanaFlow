import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modules SAP",
  description:
    "Découvre tous les modules SAP : FI, CO, MM, SD, HCM, PP et S/4HANA. Cours structurés pour débutants et futurs consultants SAP.",
  openGraph: {
    title: "Modules SAP | HanaFlow",
    description:
      "Découvre tous les modules SAP : FI, CO, MM, SD, HCM, PP et S/4HANA. Cours structurés pour débutants et futurs consultants SAP.",
    url: "/modules-sap",
  },
};

export default function ModulesSapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
