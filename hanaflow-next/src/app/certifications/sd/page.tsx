import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

// Page publique : un visiteur non connecté voit l'intro et les chapitres gratuits ;
// les chapitres premium restent verrouillés (getCertForPlan vide leur contenu).
export default async function CertificationSDPage() {
  const user = await getServerUser();

  return (
    <CertificationTemplate
      certification={getCertForPlan("sd", user?.isPro ?? false)}
      moduleId="sd"
      examPath="/certifications/sd/examen"
      heroGradient="from-purple-900 via-purple-700 to-purple-500"
    />
  );
}
