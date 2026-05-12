import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_LOGIN_PATH = "/admin/login";
const SUPER_ADMIN_PATH_PREFIX = "/super-admin";

function getAdminToken(request: NextRequest) {
  return (
    request.cookies.get("admin-token")?.value ??
    request.cookies.get("admin_token")?.value ??
    request.cookies.get("access_token")?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    ""
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = getAdminToken(request);

  if (pathname === ADMIN_LOGIN_PATH) {
    if (adminToken) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/super-admin";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith(SUPER_ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  if (!adminToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = ADMIN_LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/login"],
};
