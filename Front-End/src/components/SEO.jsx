import { Helmet } from "react-helmet-async";

const SITE_NAME = "HanaFlow";
const SITE_URL = "https://hana-flow.vercel.app";
const DEFAULT_DESC =
  "HanaFlow — Plateforme d'apprentissage SAP S/4HANA. Maîtrise les modules FI, CO, MM, SD, HCM, PP et prépare ta carrière de consultant SAP avec des quiz, checklists et roadmaps personnalisées.";
const DEFAULT_IMAGE = `${SITE_URL}/icons/icon-512.png`;

/**
 * Composant SEO — à placer en haut de chaque page
 *
 * Usage :
 * <SEO title="Module FI" description="Apprenez la comptabilité SAP FI..." path="/modules-sap/fi" />
 */
const SEO = ({ title, description, path = "", image }) => {
  const fullTitle =
    title && title !== SITE_NAME ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  /* Schema.org — EducationalOrganization (sitewide) */
  const orgSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESC,
    inLanguage: "fr-FR",
    sameAs: ["https://github.com/WissamTahiri/HanaFlow"],
    knowsAbout: [
      "SAP S/4HANA",
      "SAP FI",
      "SAP CO",
      "SAP MM",
      "SAP SD",
      "SAP HCM",
      "SAP PP",
      "SAP Joule",
      "ERP Consulting",
    ],
  });

  /* Schema.org — WebPage (par page) */
  const pageSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: fullTitle,
    description: desc,
    url: canonical,
    inLanguage: "fr-FR",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  });

  return (
    <Helmet>
      {/* Titre */}
      <title>{fullTitle}</title>

      {/* SEO de base */}
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">{orgSchema}</script>
      <script type="application/ld+json">{pageSchema}</script>
    </Helmet>
  );
};

export default SEO;
