import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const pathname = req.nextUrl.pathname;

    const publicRoutes = ["/login", "/forgot-password"];
    const isPublic = publicRoutes.includes(pathname);

    if (!isPublic) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next(); // 👈 THIS is the key line
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

  // 🚨 Allow portal routes (public supplier portal)
  if (pathname.startsWith("/portal")) {
    return NextResponse.next();
  }

  // 🚫 Block access if not logged in
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
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
    "/workflow",
    "/dashboard",
    "/products",
    "/suppliers",
    "/inventory",
    "/analytics",
    "/settings",
  ],
};
