import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

// Page publique : un visiteur non connecté voit l'intro et les chapitres gratuits ;
// les chapitres premium restent verrouillés (getCertForPlan vide leur contenu).
export default async function CertificationMMPage() {
  const user = await getServerUser();

  return (
    <CertificationTemplate
      certification={getCertForPlan("mm", user?.isPro ?? false)}
      moduleId="mm"
      examPath="/certifications/mm/examen"
      heroGradient="from-emerald-900 via-emerald-700 to-emerald-500"
    />
  );
}
