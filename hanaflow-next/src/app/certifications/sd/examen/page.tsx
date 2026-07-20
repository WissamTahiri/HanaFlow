import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestionsForClient } from "@/lib/certAccess";

export default async function SDExamPage() {
  const user = await getServerUser();
  if (!user || !user.isPro) {
    return <ProPaywall certPath="/certifications/sd" loggedOut={!user} nextPath="/certifications/sd/examen" />;
  }

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestionsForClient("sd")}
      certInfo={getCertMeta("sd")}
      moduleId="sd"
      certPath="/certifications/sd"
    />
  );
}
