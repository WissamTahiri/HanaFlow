import { redirect } from "next/navigation";

/**
 * HCM a été remplacé par AI (certification SAP officielle C_THR12 retirée
 * en mars 2025, voir src/data/cert-catalog.json). Cette redirection
 * préserve les anciens liens (Google, partages, emails).
 */
export default function Page() {
  redirect("/modules-sap/ai");
}
