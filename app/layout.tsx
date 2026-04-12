"use Client";

import Sidebar from "./components/Sidebar";
import {
  LayoutDashboard,
  Workflow,
  Package,
  Truck,
  Boxes,
  BarChart3,
  Settings,
} from "lucide-react";

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

function MenuIcon({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all ${
        href === "/workflow"
          ? "text-white bg-slate-800/60"
          : "text-slate-300 hover:text-white hover:bg-slate-800/40"
      }`}
    >
      {children}
    </a>
  );
}
function LogoMark() {
  return (
    <div className="flex items-center px-4 py-6">
      <img src="/conduit-logo.png" className="h-8 w-auto opacity-90" />
    </div>
  );
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen text-white antialiased bg-transparent`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
