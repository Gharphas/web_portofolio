import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/manage-about",
  "/manage-skills",
  "/manage-projects",
  "/manage-experience",
  "/manage-education",
  "/manage-achievements",
  "/manage-hobbies",
  "/manage-photos",
  "/manage-contact",
  "/manage-socials",
  "/settings",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is a protected admin route
  const isProtectedRoute = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtectedRoute) {
    // Check for auth token in cookies
    // Note: Since current auth uses localStorage (client-side),
    // this middleware serves as an additional layer of protection.
    // The actual auth check happens in the admin layout component.
    // When migrating to cookie-based auth, this will do full verification.
    const token = request.cookies.get("rianpedia_admin_token")?.value;

    // For now, let the client-side layout handle auth.
    // When cookie-based auth is ready, uncomment below:
    // if (!token) {
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }
  }

  // Prevent authenticated users from accessing login page
  // (would be enabled with cookie-based auth)
  // if (pathname === "/login") {
  //   const token = request.cookies.get("rianpedia_admin_token")?.value;
  //   if (token) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all admin routes
    "/dashboard/:path*",
    "/manage-:path*",
    "/settings/:path*",
    "/login",
  ],
};
