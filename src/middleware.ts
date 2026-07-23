import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role as string | undefined;

  // Protected dashboard routes
  if (pathname.startsWith("/(dashboard)")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // Auth routes - redirect to dashboard if already logged in
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    const redirectPath = role === "ADMIN" ? "/dashboard" : role === "GURU" ? "/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
