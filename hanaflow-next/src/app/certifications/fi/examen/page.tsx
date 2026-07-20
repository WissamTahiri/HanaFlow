import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestionsForClient } from "@/lib/certAccess";

// Server Component : aucune question d'examen n'arrive dans le bundle client tant
// que le serveur n'a pas vérifié que l'utilisateur est connecté ET Pro. Et même
// une fois vérifié, on passe `getExamQuestionsForClient` (sans `correctIndex`) :
// la clé de correction complète ne doit jamais être sérialisée dans le payload
// RSC, sinon un candidat pourrait la lire avant de répondre et forger un score
// 100% "vérifié serveur" (cf. lib/certAccess.ts).
export default async function FIExamPage() {
  const user = await getServerUser();
  if (!user || !user.isPro) {
    return <ProPaywall certPath="/certifications/fi" loggedOut={!user} nextPath="/certifications/fi/examen" />;
  }

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestionsForClient("fi")}
      certInfo={getCertMeta("fi")}
      moduleId="fi"
      certPath="/certifications/fi"
    />
  );
}
