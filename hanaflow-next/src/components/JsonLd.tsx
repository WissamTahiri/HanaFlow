import { headers } from "next/headers";

// Échappe les séquences qui pourraient clôturer la balise <script> ou
// permettre l'injection HTML, même si `data` devient dynamique un jour.
// Voir : https://benhoyt.com/writings/dont-leak-the-script-end-tag/
const LS = " ";
const PS = " ";

function safeJsonForScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LS).join("\\u2028")
    .split(PS).join("\\u2029");
}

/**
 * Composant Server uniquement. Lit le nonce CSP posé par `proxy.ts`
 * pour passer la politique stricte (script-src 'nonce-…' 'strict-dynamic').
 * Si le caller a déjà le nonce sous la main, il peut le passer via prop
 * pour économiser un await headers().
 */
export async function JsonLd({ data, nonce }: { data: object; nonce?: string }) {
  const resolvedNonce = nonce ?? (await headers()).get("x-nonce") ?? undefined;
  return (
    <script
      type="application/ld+json"
      nonce={resolvedNonce}
      dangerouslySetInnerHTML={{ __html: safeJsonForScript(data) }}
    />
  );
}
