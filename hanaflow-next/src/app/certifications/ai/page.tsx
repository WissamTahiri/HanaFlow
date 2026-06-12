import CertificationTemplate from "@/components/CertificationTemplate";
import { getServerUser } from "@/lib/serverAuth";
import { getCertForPlan } from "@/lib/certAccess";

// Page publique : un visiteur non connecté voit l'intro et les chapitres gratuits ;
// les chapitres premium restent verrouillés (getCertForPlan vide leur contenu).
export default async function CertificationAIPage() {
  const user = await getServerUser();

  return (
    <CertificationTemplate
      certification={getCertForPlan("ai", user?.isPro ?? false)}
      moduleId="ai"
      examPath="/certifications/ai/examen"
      heroGradient="from-violet-900 via-purple-700 to-fuchsia-500"
    />
  );
}
