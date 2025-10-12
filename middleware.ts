import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware - Pathname:", pathname);

  // Define protected routes that require authentication
  const protectedRoutes = [
    "/profile",
    "/settings",
    "/member-list",
    "/gallery",
    "/contact",
  ];

  // Define admin-only routes
  const adminRoutes = ["/admin"];

  // Check if the request is for a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute || isAdminRoute) {
    console.log("Middleware - Protected/Admin route detected:", pathname);

    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      console.log("Middleware - Session:", session?.user?.id);
      console.log("Middleware - Session Error:", sessionError);

      if (sessionError || !session?.user) {
        console.log("Middleware - No session, redirecting to login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // For admin routes, check admin status
      if (isAdminRoute) {
        console.log("Middleware - Admin route access check");

        // Get user role to check admin status
        const { data: roleData, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single();

        console.log("Middleware - Role Data:", roleData);
        console.log("Middleware - Role Error:", roleError);

        if (roleError) {
          console.error("Role fetch error in middleware:", roleError);
          return NextResponse.redirect(new URL("/login", request.url));
        }

        const isAdmin = roleData?.role?.toString().toUpperCase() === "ADMIN";
        console.log("Middleware - Is Admin:", isAdmin);
        console.log("Middleware - Role from DB:", roleData?.role);

        if (!isAdmin) {
          console.log("Middleware - Not admin, redirecting to home");
          return NextResponse.redirect(new URL("/", request.url));
        }

        console.log("Middleware - Admin access granted, continuing");
      }

      // User is authenticated (and admin if required), allow access
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For non-protected routes, just continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
