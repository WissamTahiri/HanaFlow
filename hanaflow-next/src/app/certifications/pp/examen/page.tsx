import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestionsForClient } from "@/lib/certAccess";

export default async function PPExamPage() {
  const user = await getServerUser();
  if (!user || !user.isPro) {
    return <ProPaywall certPath="/certifications/pp" loggedOut={!user} nextPath="/certifications/pp/examen" />;
  }

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestionsForClient("pp")}
      certInfo={getCertMeta("pp")}
      moduleId="pp"
      certPath="/certifications/pp"
    />
  );
}
