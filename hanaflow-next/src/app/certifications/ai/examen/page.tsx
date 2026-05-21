import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function AIExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/ai/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/ai" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("ai")}
      certInfo={getCertMeta("ai")}
      moduleId="ai"
      certPath="/certifications/ai"
    />
  );
}
