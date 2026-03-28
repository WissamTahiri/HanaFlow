import { Helmet } from "react-helmet-async";

const SITE_NAME = "HanaFlow";
const SITE_URL = "https://hanaflow.vercel.app";
const DEFAULT_DESC =
  "HanaFlow, la plateforme SAP de Wissam Tahiri pour apprendre S/4HANA, FI/CO, MM, SD et préparer une carrière de consultant SAP.";
const DEFAULT_IMAGE = `${SITE_URL}/icons/icon-512.png`;

/**
 * Composant SEO — à placer en haut de chaque page
 *
 * Usage :
 * <SEO title="Module FI" description="Apprenez la comptabilité SAP FI..." />
 */
const SEO = ({ title, description, path = "", image }) => {
  const fullTitle = title && title !== SITE_NAME ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || DEFAULT_DESC;
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* Titre */}
      <title>{fullTitle}</title>

      {/* SEO de base */}
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph (partage sur réseaux sociaux) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
