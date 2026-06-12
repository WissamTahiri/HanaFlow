import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

// Page publique : un visiteur non connecté voit l'intro et les chapitres gratuits ;
// les chapitres premium restent verrouillés (getCertForPlan vide leur contenu).
export default async function CertificationFIPage() {
  const user = await getServerUser();

  return (
    <CertificationTemplate
      certification={getCertForPlan("fi", user?.isPro ?? false)}
      moduleId="fi"
      examPath="/certifications/fi/examen"
      heroGradient="from-blue-900 via-blue-700 to-blue-500"
    />
  );
}
