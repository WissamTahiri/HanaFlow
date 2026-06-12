import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

// Page publique : un visiteur non connecté voit l'intro et les chapitres gratuits ;
// les chapitres premium restent verrouillés (getCertForPlan vide leur contenu).
export default async function CertificationPPPage() {
  const user = await getServerUser();

  return (
    <CertificationTemplate
      certification={getCertForPlan("pp", user?.isPro ?? false)}
      moduleId="pp"
      examPath="/certifications/pp/examen"
      heroGradient="from-rose-900 via-rose-700 to-pink-500"
    />
  );
}
