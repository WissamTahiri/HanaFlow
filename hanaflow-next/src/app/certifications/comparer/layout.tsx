import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparer les certifications SAP",
  description:
    "Comparateur des certifications SAP S/4HANA : C_TS4FI, C_TS4CO, C_TS452, C_TS460, C_TS422, C_AIG — niveau, nombre de questions, durée, salaire et débouchés.",
};

export default function ComparerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
