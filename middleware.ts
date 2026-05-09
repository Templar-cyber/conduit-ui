import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPortalRoute = pathname.startsWith("/portal");
  const isPortalLogin = pathname === "/portal-login";
  const isMainLogin = pathname === "/login";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  console.log("PATH:", pathname);
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: (key, value, options) => {
          res.cookies.set({ name: key, value, ...options });
        },
        remove: (key, options) => {
          res.cookies.set({ name: key, value: "", ...options });
        },
      },
    },
  );
  await supabase.auth.getSession();

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("SESSION:", session);

  const user = session?.user;

  console.log("MIDDLEWARE SESSION:", session);
  console.log("MIDDLEWARE USER:", user);
  console.log("PATH:", pathname);

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    profile = data;
  }
  console.log("USER ROLE:", profile?.role);

  // 🔐 Role-based access control (runs when user IS logged in)

  if (user) {
    // Portal → supplier only
    if (isPortalRoute && !["supplier", "admin"].includes(profile?.role))
      return NextResponse.redirect(new URL("/portal-login", req.url));

    // Dashboard → admin only
    if (isDashboardRoute && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Admin routes

  // Supplier routes (future-proof)
  if (pathname.startsWith("/supplier")) {
    if (profile.role !== "supplier") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (!profile.supplier_id) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 🔒 Define protected routes
  const publicRoutes = ["/login", "/forgot-password"];

  const protectedRoutes = [
    "/portal",
    "/dashboard",
    "/workflow",
    "/products",
    "/suppliers",
    "/inventory",
    "/analytics",
    "/settings",
    "/update-password",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 🚫 Block access if not logged in
  if (!user) {
    if (isPortalRoute && !isPortalLogin) {
      return NextResponse.redirect(new URL("/portal-login", req.url));
    }
    // 🔐 Role-based access control (only runs when user IS logged in)

    // Portal → supplier only
    if (isPortalRoute && profile?.role !== "supplier") {
      return NextResponse.redirect(new URL("/portal-login", req.url));
    }

    // Dashboard → admin only
    if (isDashboardRoute && profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!isPortalRoute && !isMainLogin) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 🔁 Optional: redirect logged-in users away from login
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  return NextResponse.next();
}

// 🎯 Apply middleware to all routes except static files
export const config = {
  matcher: [
    "/portal/:path*", // 👈 THIS is the missing piece
    "/dashboard/:path*",
    "/workflow/:path*",
    "/products/:path*",
    "/suppliers/:path*",
    "/inventory/:path*",
    "/analytics/:path*",
    "/settings/:path*",
  ],
};
