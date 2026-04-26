import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
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

  const pathname = req.nextUrl.pathname;

  // 🔒 Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/workflow",
    "/products",
    "/suppliers",
    "/inventory",
    "/analytics",
    "/settings",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 🚫 Block access if not logged in
  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 Optional: redirect logged-in users away from login
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

// 🎯 Apply middleware to all routes except static files
export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"],
};
