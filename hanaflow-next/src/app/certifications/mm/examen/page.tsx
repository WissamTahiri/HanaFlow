import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function MMExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/mm/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/mm" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("mm")}
      certInfo={getCertMeta("mm")}
      moduleId="mm"
      certPath="/certifications/mm"
    />
  );
}
