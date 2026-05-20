import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profil",
  "/achievements",
  "/admin",
  "/certifications",
  "/certificats",
];

// Pages publiques qui matchent un PROTECTED_PREFIXES mais doivent rester
// accessibles sans login (SEO, funnel d'acquisition).
const PUBLIC_EXCEPTIONS = ["/certifications/comparer"];

const ADMIN_PREFIX = "/admin";

const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Génère un nonce base64 cryptographiquement sûr pour le CSP.
 * Edge runtime → on utilise crypto.getRandomValues (pas Buffer/Node crypto).
 */
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64 sans padding
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function buildCsp(nonce: string): string {
  // 'strict-dynamic' délègue la confiance aux scripts qui ont le nonce :
  // ils peuvent ensuite charger d'autres scripts via DOM sans avoir besoin
  // de whitelist explicite. Évite la maintenance d'une longue liste.
  // En dev : Next a besoin de 'unsafe-eval' pour le HMR / reconstruct error stacks.
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${IS_DEV ? " 'unsafe-eval'" : ""}`,
    // style-src : nonce en prod ; en dev Next injecte des inline styles pour les fast refresh.
    // Tailwind v4 compile vers un fichier .css → pas d'inline en prod.
    `style-src 'self' 'nonce-${nonce}'${IS_DEV ? " 'unsafe-inline'" : ""} https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self'",
    "object-src 'none'",
    "media-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ];
  if (!IS_DEV) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ── 1) Garde d'authentification sur les routes protégées ────────────
  const isPublicException = PUBLIC_EXCEPTIONS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const needsAuth =
    !isPublicException &&
    PROTECTED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

  if (needsAuth) {
    const hasSession = Boolean(req.cookies.get("refreshToken")?.value);
    if (!hasSession) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;

      const isAdmin = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
      const res = NextResponse.redirect(loginUrl);
      if (isAdmin) res.headers.set("x-auth-redirect-reason", "admin-area");
      return res;
    }
  }

  // ── 2) Génération du nonce + CSP par requête ────────────────────────
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Le nonce est propagé via `x-nonce` pour que les Server Components
  // puissent l'extraire via `headers()` et le poser sur leurs <script> inline.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js extrait le nonce du CSP request header pour le poser automatiquement
  // sur ses propres scripts framework / chunks.
  requestHeaders.set("content-security-policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  // Skip /api/* (pas de rendu HTML, pas besoin de nonce), assets statiques,
  // et les prefetches Next (qui ne rendent pas un nouveau document).
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|robots.txt|sitemap.xml|sw.js|workbox-).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
