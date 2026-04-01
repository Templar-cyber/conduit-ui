"use Client";

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
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white"
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-[#0b1220] text-white antialiased`}
      >
        <div className="flex min-h-screen">
          <aside className="w-[255px] border-r border-slate-700/60 bg-[#0b1220]/95">
            {/* Logo */}
            <div className="border-b border-slate-700/60 px-6 py-6">
              <LogoMark />
            </div>

            {/* Nav */}
            <nav className="px-4 py-5 space-y-2">
              <MenuIcon href="/">
                <LayoutDashboard size={20} />
                Dashboard
              </MenuIcon>

              <MenuIcon href="/workflow">
                <Workflow size={20} />
                Workflow
              </MenuIcon>

              <MenuIcon href="/products">
                <Package size={20} />
                Products
              </MenuIcon>

              <MenuIcon href="/suppliers">
                <Truck size={20} />
                Suppliers
              </MenuIcon>

              <MenuIcon href="/inventory">
                <Boxes size={20} />
                Inventory
              </MenuIcon>

              <MenuIcon href="/analytics">
                <BarChart3 size={20} />
                Analytics
              </MenuIcon>

              <MenuIcon href="/settings">
                <Settings size={20} />
                Settings
              </MenuIcon>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
