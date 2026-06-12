import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

// Page publique : un visiteur non connecté voit l'intro et les chapitres gratuits ;
// les chapitres premium restent verrouillés (getCertForPlan vide leur contenu).
export default async function CertificationCOPage() {
  const user = await getServerUser();

  return (
    <CertificationTemplate
      certification={getCertForPlan("co", user?.isPro ?? false)}
      moduleId="co"
      examPath="/certifications/co/examen"
      heroGradient="from-indigo-900 via-indigo-700 to-indigo-500"
    />
  );
}
