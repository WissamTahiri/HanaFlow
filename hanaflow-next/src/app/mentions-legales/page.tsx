import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de la plateforme HanaFlow.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <LegalPage
      title="Mentions légales"
      subtitle="Informations légales obligatoires en vertu de l'article 6 III de la loi n° 2004-575 du 21 juin 2004 (LCEN)."
      lastUpdated="7 mai 2026"
    >
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>HanaFlow</strong> (https://hanaflow.vercel.app) est édité par :
      </p>
      <ul>
        <li><strong>Wissam Tahiri</strong>, en qualité d&apos;éditeur indépendant</li>
        <li>Adresse de contact : <a href="mailto:wisstahiri91@gmail.com">wisstahiri91@gmail.com</a></li>
        <li>Statut : projet personnel à vocation éducative (mise à jour de ce statut prévue lors de la création d&apos;une structure juridique)</li>
      </ul>

      <h2>Directeur de la publication</h2>
      <p>Wissam Tahiri, fondateur et responsable éditorial du site HanaFlow.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 440 N Barranca Avenue #4133,
        Covina, CA 91723, États-Unis. Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
      </p>
      <p>
        La base de données est hébergée par <strong>Neon Inc.</strong> dans la région
        Europe (Frankfurt, Allemagne).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu présent sur HanaFlow (textes pédagogiques, structure
        des cours, quiz, illustrations, code source de la plateforme) est protégé par
        le droit d&apos;auteur. Toute reproduction, représentation, modification,
        publication ou adaptation de tout ou partie des éléments du site, quel que
        soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite
        préalable.
      </p>
      <p>
        SAP, S/4HANA, ABAP, Fiori et les codes de certification (C_TS4FI_2023,
        C_TS4CO_2023, etc.) sont des marques déposées de SAP SE. HanaFlow n&apos;est
        affilié, sponsorisé ni endossé par SAP SE. La plateforme propose un contenu
        pédagogique original visant à préparer les certifications officielles SAP.
      </p>

      <h2>Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers (notamment vers SAP
        Training & Certification Hub). HanaFlow n&apos;exerce aucun contrôle sur ces
        sites et ne saurait être tenu responsable de leurs contenus.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative à ces mentions légales : <a href="mailto:wisstahiri91@gmail.com">wisstahiri91@gmail.com</a>
        {" "}ou via la page <a href="/contact">contact</a>.
      </p>
    </LegalPage>
  );
}
