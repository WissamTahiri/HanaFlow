import { redirect } from "next/navigation";
import ExamSimulatorTemplate from "@/components/ExamSimulatorTemplate";
import ProPaywall from "@/components/ProPaywall";
import { getServerUser } from "@/lib/serverAuth";
import { getCertMeta, getExamQuestions } from "@/lib/certAccess";

export default async function PPExamPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?next=/certifications/pp/examen");
  if (!user.isPro) return <ProPaywall certPath="/certifications/pp" />;

  return (
    <ExamSimulatorTemplate
      questions={getExamQuestions("pp")}
      certInfo={getCertMeta("pp")}
      moduleId="pp"
      certPath="/certifications/pp"
    />
  );
}
