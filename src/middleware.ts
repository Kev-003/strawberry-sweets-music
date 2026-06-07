import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isBandRoute = pathname.startsWith("/band");
  const isLoginPage = pathname === "/band/login";
  const isApiAuth = pathname === "/api/band/auth";

  if (isBandRoute && !isLoginPage) {
    const session = request.cookies.get("band_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/band/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/band/:path*", "/api/band/:path*"],
};