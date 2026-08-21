import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/problems", "/analytics", "/profile", "/settings", "/ai"];
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!protectedPaths.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return NextResponse.next();
  if (!request.cookies.get("intellidsa_session")?.value) {
    const url = new URL("/login", request.url); url.searchParams.set("from", path); return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/problems/:path*", "/analytics/:path*", "/profile/:path*", "/settings/:path*", "/ai/:path*"] };
