import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashcards SAP",
  description:
    "Mémorise les T-codes, tables et concepts SAP avec 6 decks de flashcards (FI, CO, MM, SD, PP, IA) et un algorithme de répétition espacée SM-2.",
};

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
