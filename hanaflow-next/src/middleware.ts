import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/profil",
  "/achievements",
  "/admin",
  "/certifications",
];

const ADMIN_PREFIX = "/admin";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!needsAuth) return NextResponse.next();

  const hasSession = Boolean(req.cookies.get("refreshToken")?.value);
  if (hasSession) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`;

  const isAdmin = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const res = NextResponse.redirect(loginUrl);
  if (isAdmin) res.headers.set("x-auth-redirect-reason", "admin-area");
  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profil/:path*",
    "/achievements/:path*",
    "/admin/:path*",
    "/certifications/:path*",
  ],
};
