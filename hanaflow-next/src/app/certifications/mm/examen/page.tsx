import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function MMExamPage() {
  const user = await getServerUser();
  if (!user || !user.isPro) {
    return <ProPaywall certPath="/certifications/mm" loggedOut={!user} nextPath="/certifications/mm/examen" />;
  }

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("mm")}
      certInfo={getCertMeta("mm")}
      moduleId="mm"
      certPath="/certifications/mm"
    />
  );
}
