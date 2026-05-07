import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles sur HanaFlow.",
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      subtitle="Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée."
      lastUpdated="7 mai 2026"
    >
      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données personnelles est <strong>Wissam Tahiri</strong>,
        éditeur de HanaFlow. Pour toute demande relative à vos données : <a href="mailto:wisstahiri91@gmail.com">wisstahiri91@gmail.com</a>.
      </p>

      <h2>2. Données collectées</h2>
      <p>HanaFlow collecte les données suivantes :</p>
      <h3>Lors de l&apos;inscription</h3>
      <ul>
        <li><strong>Nom</strong> (champ libre)</li>
        <li><strong>Adresse e-mail</strong> (utilisée comme identifiant)</li>
        <li><strong>Mot de passe</strong> (stocké sous forme de hash argon2id, jamais en clair)</li>
      </ul>
      <h3>Lors de l&apos;utilisation du service</h3>
      <ul>
        <li>Modules SAP visités et progression</li>
        <li>Date et heure de connexion</li>
        <li>Codes promo utilisés</li>
        <li>Statut du compte (Free, Pro, Suspendu)</li>
      </ul>
      <h3>Données techniques</h3>
      <ul>
        <li>Adresse IP (pour la sécurité et le rate limiting, conservée 30 jours)</li>
        <li>Cookies de session (token JWT, refresh token httpOnly)</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <table>
        <thead>
          <tr><th>Finalité</th><th>Base légale</th></tr>
        </thead>
        <tbody>
          <tr><td>Création et gestion du compte</td><td>Exécution du contrat (CGU)</td></tr>
          <tr><td>Suivi de progression pédagogique</td><td>Exécution du contrat</td></tr>
          <tr><td>Sécurité (rate limiting, détection de fraude)</td><td>Intérêt légitime</td></tr>
          <tr><td>Communication relative au service</td><td>Exécution du contrat</td></tr>
          <tr><td>Statistiques anonymisées</td><td>Intérêt légitime</td></tr>
        </tbody>
      </table>

      <h2>4. Destinataires des données</h2>
      <p>Les données ne sont jamais vendues. Elles sont accessibles uniquement à :</p>
      <ul>
        <li><strong>Wissam Tahiri</strong>, éditeur de HanaFlow</li>
        <li>Les <strong>sous-traitants techniques</strong> nécessaires au fonctionnement du service :
          <ul>
            <li><strong>Vercel Inc.</strong> (hébergement de la plateforme, États-Unis — clauses contractuelles types CCT en place)</li>
            <li><strong>Neon Inc.</strong> (base de données PostgreSQL, région Europe Frankfurt)</li>
          </ul>
        </li>
      </ul>

      <h2>5. Durée de conservation</h2>
      <ul>
        <li><strong>Compte actif</strong> : durée de l&apos;abonnement + 3 ans après dernière connexion</li>
        <li><strong>Données de progression</strong> : durée du compte</li>
        <li><strong>Logs de sécurité</strong> : 30 jours</li>
        <li><strong>Données de facturation</strong> (à venir avec Stripe) : 10 ans (obligation légale comptable)</li>
      </ul>

      <h2>6. Vos droits (RGPD)</h2>
      <p>Vous disposez des droits suivants sur vos données :</p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
        <li><strong>Droit de rectification</strong> : corriger des informations inexactes</li>
        <li><strong>Droit à l&apos;effacement</strong> (« droit à l&apos;oubli ») : suppression de votre compte</li>
        <li><strong>Droit à la portabilité</strong> : récupérer vos données en format structuré</li>
        <li><strong>Droit d&apos;opposition</strong> au traitement</li>
        <li><strong>Droit de limitation</strong> du traitement</li>
      </ul>
      <p>
        Pour exercer ces droits : <a href="mailto:wisstahiri91@gmail.com">wisstahiri91@gmail.com</a>.
        Une réponse est apportée sous <strong>1 mois maximum</strong>.
      </p>
      <p>
        En cas de désaccord, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> :
        {" "}<a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>.
      </p>

      <h2>7. Cookies</h2>
      <p>HanaFlow utilise uniquement des cookies strictement nécessaires au fonctionnement du service (token de session, refresh token httpOnly). Conformément à l&apos;article 82 de la loi Informatique et Libertés, ces cookies ne nécessitent pas de consentement.</p>
      <p>Aucun cookie publicitaire, de tracking ni d&apos;analytics tiers n&apos;est utilisé.</p>

      <h2>8. Sécurité</h2>
      <p>HanaFlow met en œuvre les mesures de sécurité suivantes :</p>
      <ul>
        <li>Mots de passe hachés avec <strong>argon2id</strong> (état de l&apos;art 2026)</li>
        <li>Communication HTTPS chiffrée TLS 1.3</li>
        <li>Tokens JWT à durée courte (1h) + refresh tokens révocables</li>
        <li>Rate limiting sur les endpoints sensibles</li>
        <li>Headers de sécurité (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)</li>
      </ul>

      <h2>9. Transferts hors UE</h2>
      <p>
        L&apos;hébergeur Vercel est basé aux États-Unis. Les transferts de données sont
        encadrés par les <strong>Clauses Contractuelles Types</strong> (CCT) approuvées
        par la Commission européenne. La base de données reste en Europe (Frankfurt).
      </p>

      <h2>10. Modifications de la politique</h2>
      <p>
        Cette politique peut être mise à jour. Les modifications substantielles seront
        notifiées par e-mail aux utilisateurs concernés.
      </p>
    </LegalPage>
  );
}
