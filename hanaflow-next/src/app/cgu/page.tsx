import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme HanaFlow.",
  alternates: { canonical: "/cgu" },
};

export default function CGU() {
  return (
    <LegalPage
      title="Conditions générales d'utilisation"
      subtitle="Règles applicables à toute utilisation de la plateforme HanaFlow."
      lastUpdated="7 mai 2026"
    >
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d&apos;utilisation (ci-après <strong>« CGU »</strong>)
        ont pour objet de définir les modalités et conditions d&apos;utilisation de la
        plateforme HanaFlow accessible à l&apos;adresse <a href="https://hanaflow.vercel.app">hanaflow.vercel.app</a>.
        L&apos;utilisation du service implique l&apos;acceptation pleine et entière des
        présentes CGU par l&apos;Utilisateur.
      </p>

      <h2>2. Définitions</h2>
      <ul>
        <li><strong>Service</strong> : la plateforme éducative HanaFlow et l&apos;ensemble de ses fonctionnalités</li>
        <li><strong>Utilisateur</strong> : toute personne disposant d&apos;un compte sur HanaFlow</li>
        <li><strong>Compte Free</strong> : compte gratuit avec accès limité (chapitre 1 des certifications, modules SAP)</li>
        <li><strong>Compte Pro</strong> : compte premium donnant accès à l&apos;ensemble du contenu</li>
        <li><strong>Contenu</strong> : cours, quiz, simulateurs d&apos;examen, ressources pédagogiques fournis sur la plateforme</li>
      </ul>

      <h2>3. Inscription et compte utilisateur</h2>
      <p>
        L&apos;inscription sur HanaFlow est ouverte à toute personne physique majeure ou
        mineure avec autorisation parentale. L&apos;Utilisateur s&apos;engage à fournir des
        informations exactes lors de son inscription (nom, adresse e-mail valide).
      </p>
      <p>
        L&apos;Utilisateur est seul responsable de la confidentialité de son mot de
        passe et de toute activité réalisée depuis son compte. En cas de soupçon
        d&apos;utilisation frauduleuse, l&apos;Utilisateur doit en informer immédiatement
        l&apos;Éditeur.
      </p>

      <h2>4. Accès au service</h2>
      <p>
        L&apos;Éditeur s&apos;efforce de maintenir le service accessible 24h/24, 7j/7. Toutefois,
        l&apos;accès peut être interrompu pour des raisons de maintenance, de mise à jour
        ou de force majeure. L&apos;Éditeur ne saurait être tenu responsable des
        dommages résultant d&apos;une indisponibilité temporaire du service.
      </p>

      <h2>5. Engagements de l'Utilisateur</h2>
      <p>L&apos;Utilisateur s&apos;engage à :</p>
      <ul>
        <li>Utiliser le service conformément à sa destination pédagogique</li>
        <li>Ne pas tenter de contourner les protections techniques du service</li>
        <li>Ne pas reproduire, copier, vendre ou exploiter commercialement le contenu sans autorisation</li>
        <li>Ne pas utiliser de scripts automatisés (bots, scrapers) pour extraire le contenu</li>
        <li>Respecter les autres utilisateurs et les éventuels modérateurs</li>
        <li>Ne pas partager ses identifiants de connexion avec un tiers</li>
      </ul>

      <h2>6. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu pédagogique (textes, structures de cours, quiz,
        explications) est la propriété exclusive de HanaFlow. Toute reproduction
        ou exploitation non autorisée constitue une contrefaçon sanctionnée par
        les articles L335-2 et suivants du Code de la propriété intellectuelle.
      </p>
      <p>
        L&apos;Utilisateur dispose d&apos;un droit d&apos;usage personnel et non transmissible
        du contenu, dans le cadre strict de sa formation individuelle.
      </p>

      <h2>7. Données personnelles</h2>
      <p>
        Le traitement des données personnelles est régi par notre <a href="/confidentialite">Politique
        de confidentialité</a>, conforme au Règlement (UE) 2016/679 (RGPD).
      </p>

      <h2>8. Suspension et résiliation</h2>
      <p>
        L&apos;Éditeur se réserve le droit de suspendre ou supprimer un compte en cas de
        manquement aux présentes CGU, et notamment en cas de tentative de fraude,
        de comportement abusif ou de partage de compte.
      </p>
      <p>
        L&apos;Utilisateur peut à tout moment supprimer son compte depuis la page profil
        ou en contactant <a href="mailto:wisstahiri91@gmail.com">wisstahiri91@gmail.com</a>.
      </p>

      <h2>9. Limitation de responsabilité</h2>
      <p>
        HanaFlow propose un contenu pédagogique préparant aux certifications SAP
        mais <strong>ne garantit pas la réussite à l&apos;examen officiel</strong>. La
        certification SAP est délivrée exclusivement par SAP SE après passage de
        l&apos;examen sur SAP Training & Certification Hub, payant et indépendant
        d&apos;HanaFlow.
      </p>

      <h2>10. Modification des CGU</h2>
      <p>
        L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment.
        Les Utilisateurs seront informés des modifications substantielles par e-mail
        ou par notification sur la plateforme. Les CGU en vigueur sont celles
        publiées sur cette page.
      </p>

      <h2>11. Loi applicable et juridiction</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige et à
        défaut d&apos;accord amiable, les tribunaux français seront seuls compétents.
      </p>
    </LegalPage>
  );
}
