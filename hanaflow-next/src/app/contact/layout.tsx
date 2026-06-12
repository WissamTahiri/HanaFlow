import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur HanaFlow, le plan Pro ou l'offre écoles ? Contactez l'équipe par email — réponse sous 48 h ouvrées.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
