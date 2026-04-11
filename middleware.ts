import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function todayIsoLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Legacy `/strands-hint` URLs → `/YYYY-MM-DD`.
 * Optional: `STRANDS_HOME_REDIRECT=1` redirects `/` to today's `/YYYY-MM-DD`.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/strands-hint" || pathname === "/strands-hint/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${todayIsoLocal()}`;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/strands-hint/")) {
    const rest = pathname.slice("/strands-hint/".length).replace(/\/$/, "");
    if (/^\d{4}-\d{2}-\d{2}$/.test(rest)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${rest}`;
      return NextResponse.redirect(url);
    }
  }

  if (process.env.STRANDS_HOME_REDIRECT === "1" && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${todayIsoLocal()}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/strands-hint", "/strands-hint/:path*"],
};
