import { redirect } from "next/navigation";

/**
 * /roadmap-personnalisee a été fusionné dans /roadmap. Cette page redirige
 * en permanence pour ne pas casser les anciens liens (emails, partages,
 * Google Search). Server Component → redirect côté serveur, propre 308.
 */
export default function Page() {
  redirect("/roadmap");
}
