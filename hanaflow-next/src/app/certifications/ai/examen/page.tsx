import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function AIExamPage() {
  const user = await getServerUser();
  if (!user || !user.isPro) {
    return <ProPaywall certPath="/certifications/ai" loggedOut={!user} nextPath="/certifications/ai/examen" />;
  }

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("ai")}
      certInfo={getCertMeta("ai")}
      moduleId="ai"
      certPath="/certifications/ai"
    />
  );
}
